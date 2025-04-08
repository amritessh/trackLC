// src/components/Header.tsx
import React from "react"

function Header() {
  return (
    <header className="flex items-center justify-center bg-[#2f80ed] text-white p-4">
      <img src="../assets/icon.png" alt="LeetSync Logo" className="w-6 h-6 mr-2" />
      <h1 className="text-xl font-bold">LeetSync</h1>
    </header>
  )
}

export default Header