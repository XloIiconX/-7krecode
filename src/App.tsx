import { useState } from 'react';
import './App.css';
import { Analytics } from "@vercel/analytics/react";

interface Statuses {
  [key: string]: string;
}

function App() {
const [pid, setPid] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<CouponResult[]>([])
  const [progress, setProgress] = useState(0)
  const [currentCode, setCurrentCode] = useState("")

  const codes = [
    "RINKARMA",
    "GUILDWAR",
    "7SENASENA7",
    "GOODLUCK",
    "THANKYOU",
    "LOVELYRUBY",
    "REBIRTHBACK",
    "BONVOYAGE",
    "YONGSANIM",
    "TREASURE",
    "WELCOMEBACK",
    "THEMONTHOFSENA",
    "EVANKARIN",
    "DARKKNIGHTS",
    "SENAHAJASENA",
    "CMMAY",
    "7777777",
    "LOVESENA",
    "INFINITETOWER",
    "UPDATES",
    "SENARAID",
    "SENAEVENTS",
    "SECRETCODE",
    "MAILBOX",
    "YUISSONG",
    "RELEASEPET",
    "MOREKEYS",
    "WELCOMESENA",
    "HEROSOMMON",
    "SENAREGOGO",
    "SHOWMETHEMONEY",
    "PDKIMJUNGKI",
    "INFOCODEX",
    "THEHOLYCROSS",
    "FUSEGETSPECIAL",
    "ADVENTURER",
    "NOHOSCHRONICLE",
    "VALKYRIE",
    "LEGENDSRAID",
    "STORYEVENT",
    "SURPRISE",
    "INTOTHESENA",
  ]

  const redeemCoupons = async () => {
    if (!pid || pid.length < 8) {
      alert("PID must be at least 8 characters long.")
      return
    }

    setIsRunning(true)
    setResults([])
    setProgress(0)

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 (CouponScript)",
      Origin: "https://coupon.netmarble.com",
      Referer: "https://coupon.netmarble.com/tskgb",
    }

    const basePayload = {
      gameCode: "tskgb",
      langCd: "KO_KR",
      pid: pid,
    }

    for (let i = 0; i < codes.length; i++) {
      const code = codes[i]
      setCurrentCode(code)

      try {
        const payload = {
          ...basePayload,
          couponCode: code,
        }

        const response = await fetch("/api/redeem-coupon", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payload, headers }),
        })

        const data = await response.json()

        let result: CouponResult
        if (data.error) {
          result = { code, status: "error", message: data.error }
        } else {
          const { errorCode, errorMessage, resultCd, message } = data

          if (errorCode === 24004 || /이미|초과/.test(errorMessage || "")) {
            result = { code, status: "used", message: "Already used code" }
          } else if (resultCd === "00" || /정상/.test(message || "")) {
            result = { code, status: "error", message: errorMessage || "API returned success code" }
          } else {
            result = { code, status: "success", message: "Successfully redeemed" }
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
