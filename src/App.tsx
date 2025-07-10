import { useState } from 'react';
import './App.css';
import { Analytics } from "@vercel/analytics/react";

interface CouponResult {
  code: string
  status: "success" | "used" | "error"
  message: string
}

export default function NetmarbleCouponRedeemer() {
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

        setResults((prev) => [...prev, result])
        setProgress(((i + 1) / codes.length) * 100)

        // 2초 대기
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (error) {
        const result: CouponResult = {
          code,
          status: "error",
          message: error instanceof Error ? error.message : "Network error",
        }
        setResults((prev) => [...prev, result])
        setProgress(((i + 1) / codes.length) * 100)
      }
    }

    setIsRunning(false)
    setCurrentCode("")
  }

  const getStatusIcon = (status: CouponResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "used":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusBadge = (status: CouponResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        )
      case "used":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Used
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
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
