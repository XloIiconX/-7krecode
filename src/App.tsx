import { useState } from 'react';
import './App.css';
import { Analytics } from "@vercel/analytics/react";

interface Statuses {
  [key: string]: string;
}

function App() {
  const [token, setToken] = useState("");
  const [statuses, setStatuses] = useState<Statuses>({});

  const api = "https://coupon.netmarble.com/api/coupon";
  const couponCodes = ["RINKARMA","SECRETCODE"].reverse();

  async function fetchCoupon(code: string) {
    setStatuses(prevStatuses => ({
      ...prevStatuses,
      [code]: "Using"
    }));

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (CouponScript)",
      Origin: "https://coupon.netmarble.com",
      Referer: "https://coupon.netmarble.com/tskgb",
    }

    const payload = {
      gameCode: "tskgb",
      couponCode: code,
      langCd: "TH_TH",
      pid: token
    };

    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Referer': 'https://coupon.netmarble.com/tskgb',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(`Coupon code ${code} response:`, data);

      if (data.httpStatus == 400) {
        setStatuses(prevStatuses => ({
          ...prevStatuses,
          [code]: "Already Use  or Fail ❌"
        }));
      } else {
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
        <h2>Seven Knights Rebirth Auto Coupon</h2>
        <p>({couponCodes.length} / 77 Codes)</p>
        <script src="https://gist.github.com/myosotis-s/6b543de1ed65396ed83c142d95876b0c.js"></script>
        <input placeholder='Enter Member code' value={token} onChange={handleTokenChange}></input>
        <h2 className='btn' onClick={handleGetItemsClick}>Get Items</h2>
        <div className="statuses">
          {couponCodes.map(code => (
            <h3 key={code}>
              {code}: {statuses[code] || "unuse"} { }
            </h3>
          ))}
        </div>
      </div>
      <Analytics />
    </>
  )
}

export default App;
