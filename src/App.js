import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const base_url = `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_NOT_SECRET_CODE}/latest/USD`;
console.log(process.env);
function App() {

  const [currencyOptions, setCurrencyOptions] = useState([]); // list of all available currencies
  //console.log(currencyOptions);
  const [fromCurrency, setFromCurrency] = useState(); // upar wale box mein jo 1st currency display hoga , in this case 'USD'
  const [toCurrency, setToCurrency] = useState(); // neeche wale box mein jo 1st currency display hoga , in this case 'AED'
  const [exchangeRate, setExchangeRate] = useState(); // exchange rate ko set karna
  // console.log(exchangeRate);
  const [amount, setAmount] = useState(1); //inital amount 1 set hai

  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);   //yeh batayega ki upar wale box se neeche wale box mein convert kar rahe hai ya phir neeche wale box se upar wale box mein convert kar rahe hain

  let toAmount, fromAmount;

  if (amountInFromCurrency) { // converting from USD to AED
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else { // converting from AED to USD
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }


  useEffect(() => {
    fetch(base_url)
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        const firstcurrency = Object.keys(data.conversion_rates)[1];  //[0]->USD , [1]->AED
        //console.log(firstcurrency);
        setCurrencyOptions([...Object.keys(data.conversion_rates)])  //saara available currencies ko set kar diya
        setFromCurrency(data.base_code); //USD
        setToCurrency(firstcurrency); //AED
        setExchangeRate(data.conversion_rates[firstcurrency]);
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_NOT_SECRET_CODE}/pair/${fromCurrency}/${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          //console.log(data);
          setExchangeRate(data.conversion_rate);
        })
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {  // yeh function uss samay trigger hoga jab jab upar se neeche convert karenge (USD->AED)
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {  // yeh function uss samay trigger hoga jab jab neeche se upar convert karenge (AED->USD)
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }
  return (
    <>
      <div className="card">
        <h1>Currency Converter</h1>
        <div className="container">
          <CurrencyRow currencyOptions={currencyOptions}
            selectedCurrency={fromCurrency}
            onChangeCurrency={e => setFromCurrency(e.target.value)}
            onChangeAmount={handleFromAmountChange}
            amount={fromAmount} />
          <div className="equals">=</div>
          <CurrencyRow currencyOptions={currencyOptions}
            selectedCurrency={toCurrency}
            onChangeCurrency={e => setToCurrency(e.target.value)}
            onChangeAmount={handleToAmountChange}
            amount={toAmount} />
        </div>
      </div>
    </>
  );
}

export default App;
