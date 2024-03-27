import { useState } from 'react';
import './App.css';

function App() {
  const [token, setToken] = useState(""); 

  const api = "https://corsproxy.io/?https://coupon.netmarble.com/api/coupon";
  const couponCodes = ["FEELINGEXP", "ROCKNLUNA", "EXCELLENTEQUIPMENT", "LEGENDHUNTER", "TWINKLE7K", "STEPPETSTEP", "HEROES4U", "IAMURHERO", "UCANFINDIT", "HEREIAM", "SIRMYTHICSIR", "UPGRADECOMPLETE", "ENFORCELEGEND", "HAPPYMARCHWITHSK2", "EXPHUNTER", "DOUWANTSTONE", "POTENTIALUP", "7KLOVEYOU", "MOREMAPS", "READY2PLAYRAID", "GETAHIGHGRADE", "SHINYJEWEL", "YELLOWSOULSTONE", "EVERY1LIKESMYTH", "S2VANESSAS2"];

  async function fetchCoupon(code:any) {
    const payload = {
      couponCode: code,
      gameCode: "sk2gb",
      langCd: "EN_US",
      pid: token
    };

    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Referer': 'https://coupon.netmarble.com/sk2gb',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(`Coupon code ${code} response:`, data);
    } catch (error) {
      console.error(`Error fetching coupon code ${code}:`, error);
    }
  }

  const handleTokenChange = (event:any) => {
    setToken(event.target.value);
  }

  const handleGetItemsClick = () => {
    if (token.trim() !== "") {
      couponCodes.forEach(fetchCoupon);
    } else {
      alert('token is empty');
    }
  }

  return (
    <>
      <div className="container">
        <div className="bg"></div>
        <h2>7K2 Auto Coupons</h2>
        <input placeholder='Your Account Token' value={token} onChange={handleTokenChange}></input>
        <h2 className='btn' onClick={handleGetItemsClick}>Get Items</h2>
      </div>
    </>
  )
}

export default App;
