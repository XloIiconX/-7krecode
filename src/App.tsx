import { useState } from 'react';
import './App.css';
import { Analytics } from "@vercel/analytics/react";

interface Statuses {
  [key: string]: string;
}

function App() {
  const [token, setToken] = useState("");
  const [statuses, setStatuses] = useState<Statuses>({}); 

  const api = "https://corsproxy.io/?https://coupon.netmarble.com/api/coupon";
  const couponCodes = ["FEELINGEXP", "ROCKNLUNA", "EXCELLENTEQUIPMENT", "LEGENDHUNTER", "TWINKLE7K", "STEPPETSTEP", "HEROES4U", "IAMURHERO", "UCANFINDIT", "HEREIAM", "SIRMYTHICSIR", "UPGRADECOMPLETE", "ENFORCELEGEND", "HAPPYMARCHWITHSK2", "EXPHUNTER", "DOUWANTSTONE", "POTENTIALUP", "7KLOVEYOU", "MOREMAPS", "READY2PLAYRAID", "GETAHIGHGRADE", "SHINYJEWEL", "YELLOWSOULSTONE", "EVERY1LIKESMYTH", "S2VANESSAS2","JEWELCOLLECTOR", "MYTHICMANIA", "SUNNSOLAR", "BLINGJEWEL"].reverse();

  async function fetchCoupon(code: string) {
    setStatuses(prevStatuses => ({
      ...prevStatuses,
      [code]: "Using" 
    }));

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

      if(data.httpStatus==400){
        setStatuses(prevStatuses => ({
          ...prevStatuses,
          [code]: "Already Use  or Fail ❌"
        }));
      }else{
        setStatuses(prevStatuses => ({
          ...prevStatuses,
          [code]: "Get rewards ✅"
        }));
      }
    } catch (error) {
      console.error(`Error fetching coupon code ${code}:`, error);

      setStatuses(prevStatuses => ({
        ...prevStatuses,
        [code]: "error"
      }));
    }
  }

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  }

  const handleGetItemsClick = () => {
    if (token.trim() !== "") {
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < couponCodes.length) {
          fetchCoupon(couponCodes[index]);
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
    } else {
      alert('token is empty');
    }
  }

  return (
    <>
      <div className="container">
        <div className="bg"></div>
        <h2>7K2 Auto Coupons</h2>
        <p>({couponCodes.length} / 50 Codes)</p>
        <input placeholder='Enter Member code' value={token} onChange={handleTokenChange}></input>
        <h2 className='btn' onClick={handleGetItemsClick}>Get Items</h2>
        <div className="statuses">
        {couponCodes.map(code => (
          <h3 key={code}>
            {code}: {statuses[code] || "unuse"} {}
          </h3>
        ))}
      </div>
      </div>
      <Analytics />
    </>
  )
}

export default App;
