import { useEffect, useState } from 'react';
import './App.css';
import { Analytics } from "@vercel/analytics/react";

interface Statuses {
  [key: string]: string;
}

function App() {
  const [token, setToken] = useState("");
  const [statuses, setStatuses] = useState<Statuses>({});

  const api = "https://corsproxy.io/?https://coupon.netmarble.com/api/coupon";
  const couponCodes = ["RINKARMA","SECRETCODE"].reverse();

  useEffect(() => {
    fetch('https://ipinfo.io/json')
      .then(response => response.json())
      .then(data => {
        const url = 'https://unilibs-analytics-backend.vercel.app/api/analysis/active';
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            analysis_id: 'e7f72bb4-fab3-4231-988a-4174157c6f13',
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country
          })
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  async function fetchCoupon(code: string) {
    setStatuses(prevStatuses => ({
      ...prevStatuses,
      [code]: "Using"
    }));

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
