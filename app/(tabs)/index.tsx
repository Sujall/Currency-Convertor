import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCw, ChevronDown, Search } from 'lucide-react-native';
import axios from 'axios';

// Types
interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

interface ExchangeRates {
  [key: string]: number;
}

export default function ConvertScreen() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCurrencySelector, setShowCurrencySelector] = useState<'from' | 'to' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [popularCurrencies, setPopularCurrencies] = useState<Currency[]>([]);
  const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);

  // Initialize popular currencies
  useEffect(() => {
    const popular: Currency[] = [
      { code: 'USD', name: 'US Dollar', symbol: '$', flag: 'https://flagcdn.com/w80/us.png' },
      { code: 'EUR', name: 'Euro', symbol: '€', flag: 'https://flagcdn.com/w80/eu.png' },
      { code: 'GBP', name: 'British Pound', symbol: '£', flag: 'https://flagcdn.com/w80/gb.png' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: 'https://flagcdn.com/w80/jp.png' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: 'https://flagcdn.com/w80/ca.png' },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: 'https://flagcdn.com/w80/au.png' },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: 'https://flagcdn.com/w80/cn.png' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: 'https://flagcdn.com/w80/in.png' },
    ];
    setPopularCurrencies(popular);
  }, []);

  // Fetch exchange rates and all currencies
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, you would use a paid API like exchangerate-api.com or currencylayer.com
        // For demo purposes, we'll use a free API with limited functionality
        const response = await axios.get('https://open.er-api.com/v6/latest/USD');
        setExchangeRates(response.data.rates);
        
        // Create all currencies array from the rates
        const currencies: Currency[] = Object.keys(response.data.rates).map(code => {
          const countryCode = code === 'EUR' ? 'eu' : code.slice(0, 2).toLowerCase();
          return {
            code,
            name: getCurrencyName(code),
            symbol: getCurrencySymbol(code),
            flag: `https://flagcdn.com/w80/${countryCode}.png`
          };
        });
        
        setAllCurrencies(currencies);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch exchange rates. Please try again later.');
        setLoading(false);
        console.error('Error fetching exchange rates:', err);
      }
    };

    fetchExchangeRates();
  }, []);

  // Convert currency whenever amount, fromCurrency, or toCurrency changes
  useEffect(() => {
    if (exchangeRates && Object.keys(exchangeRates).length > 0) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  // Helper function to get currency name
  const getCurrencyName = (code: string): string => {
    const currencyNames: { [key: string]: string } = {
      'USD': 'US Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound',
      'JPY': 'Japanese Yen',
      'CAD': 'Canadian Dollar',
      'AUD': 'Australian Dollar',
      'CNY': 'Chinese Yuan',
      'INR': 'Indian Rupee',
      // Add more as needed
    };
    return currencyNames[code] || code;
  };

  // Helper function to get currency symbol
  const getCurrencySymbol = (code: string): string => {
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CNY': '¥',
      'INR': '₹',
      // Add more as needed
    };
    return currencySymbols[code] || code;
  };

  // Convert currency
  const convertCurrency = () => {
    if (!amount || isNaN(Number(amount))) {
      setConvertedAmount('');
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      return;
    }

    // Convert to USD first (as base), then to target currency
    const amountInUSD = fromCurrency === 'USD' 
      ? Number(amount) 
      : Number(amount) / exchangeRates[fromCurrency];
    
    const result = toCurrency === 'USD' 
      ? amountInUSD 
      : amountInUSD * exchangeRates[toCurrency];
    
    setConvertedAmount(result.toFixed(2));
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Filter currencies based on search query
  const filteredCurrencies = allCurrencies.filter(currency => 
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Select currency
  const selectCurrency = (code: string) => {
    if (showCurrencySelector === 'from') {
      setFromCurrency(code);
    } else if (showCurrencySelector === 'to') {
      setToCurrency(code);
    }
    setShowCurrencySelector(null);
    setSearchQuery('');
  };

  // Get currency details
  const getCurrencyDetails = (code: string): Currency | undefined => {
    return allCurrencies.find(currency => currency.code === code);
  };

  const fromCurrencyDetails = getCurrencyDetails(fromCurrency);
  const toCurrencyDetails = getCurrencyDetails(toCurrency);

  // Render currency selector
  const renderCurrencySelector = () => {
    return (
      <View style={styles.selectorContainer}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search currency..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
            autoFocus
          />
        </View>
        
        <Text style={styles.sectionTitle}>Popular Currencies</Text>
        <View style={styles.popularGrid}>
          {popularCurrencies.map(currency => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.popularItem,
                (showCurrencySelector === 'from' && fromCurrency === currency.code) ||
                (showCurrencySelector === 'to' && toCurrency === currency.code)
                  ? styles.selectedCurrency
                  : null
              ]}
              onPress={() => selectCurrency(currency.code)}
            >
              {currency.flag && (
                <Image source={{ uri: currency.flag }} style={styles.flagIcon} />
              )}
              <Text style={styles.currencyCode}>{currency.code}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>All Currencies</Text>
        <ScrollView style={styles.currencyList}>
          {filteredCurrencies.map(currency => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.currencyItem,
                (showCurrencySelector === 'from' && fromCurrency === currency.code) ||
                (showCurrencySelector === 'to' && toCurrency === currency.code)
                  ? styles.selectedCurrency
                  : null
              ]}
              onPress={() => selectCurrency(currency.code)}
            >
              {currency.flag && (
                <Image 
                  source={{ uri: currency.flag }} 
                  style={styles.flagIcon}
                  onError={(e) => console.log(`Failed to load flag for ${currency.code}`)}
                />
              )}
              <View style={styles.currencyInfo}>
                <Text style={styles.currencyCode}>{currency.code}</Text>
                <Text style={styles.currencyName}>{currency.name}</Text>
              </View>
              <Text style={styles.currencySymbol}>{currency.symbol}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Currency Converter</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={() => {
            setLoading(true);
            // Re-fetch exchange rates
            axios.get('https://open.er-api.com/v6/latest/USD')
              .then(response => {
                setExchangeRates(response.data.rates);
                setLoading(false);
              })
              .catch(err => {
                setError('Failed to refresh rates');
                setLoading(false);
              });
          }}
        >
          <RefreshCw size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {loading && Object.keys(exchangeRates).length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading exchange rates...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              // Re-fetch exchange rates
              axios.get('https://open.er-api.com/v6/latest/USD')
                .then(response => {
                  setExchangeRates(response.data.rates);
                  setLoading(false);
                })
                .catch(err => {
                  setError('Failed to fetch exchange rates. Please try again later.');
                  setLoading(false);
                });
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.converterContainer}>
          {/* From Currency */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity 
                style={styles.currencySelector}
                onPress={() => setShowCurrencySelector('from')}
              >
                <View style={styles.selectedCurrencyContainer}>
                  {fromCurrencyDetails?.flag && (
                    <Image source={{ uri: fromCurrencyDetails.flag }} style={styles.selectedFlag} />
                  )}
                  <Text style={styles.selectedCurrencyText}>{fromCurrency}</Text>
                  <ChevronDown size={16} color="#64748B" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Swap Button */}
          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <RefreshCw size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* To Currency */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Converted Amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.convertedAmountText}>
                {convertedAmount ? convertedAmount : '0.00'}
              </Text>
              <TouchableOpacity 
                style={styles.currencySelector}
                onPress={() => setShowCurrencySelector('to')}
              >
                <View style={styles.selectedCurrencyContainer}>
                  {toCurrencyDetails?.flag && (
                    <Image source={{ uri: toCurrencyDetails.flag }} style={styles.selectedFlag} />
                  )}
                  <Text style={styles.selectedCurrencyText}>{toCurrency}</Text>
                  <ChevronDown size={16} color="#64748B" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Exchange Rate Info */}
          <View style={styles.rateInfoContainer}>
            <Text style={styles.rateInfoText}>
              1 {fromCurrency} = {exchangeRates[toCurrency] / exchangeRates[fromCurrency]} {toCurrency}
            </Text>
            {loading && <ActivityIndicator size="small" color="#3B82F6" style={styles.miniLoader} />}
          </View>
        </View>
      )}

      {/* Currency Selector Modal */}
      {showCurrencySelector && renderCurrencySelector()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  converterContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  amountInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  convertedAmountText: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    textAlignVertical: 'center',
    paddingTop: Platform.OS === 'ios' ? 16 : 14,
  },
  currencySelector: {
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  selectedCurrencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCurrencyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginRight: 4,
  },
  selectedFlag: {
    width: 24,
    height: 16,
    marginRight: 8,
    borderRadius: 2,
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#3B82F6',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  rateInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  rateInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  miniLoader: {
    marginLeft: 10,
  },
  selectorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  popularItem: {
    width: '23%',
    aspectRatio: 1,
    margin: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  currencyList: {
    flex: 1,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectedCurrency: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  flagIcon: {
    width: 24,
    height: 16,
    borderRadius: 2,
    marginRight: 12,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
  },
  currencyName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  currencySymbol: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
});