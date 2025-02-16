"use client"

import { useState, useEffect } from "react"
import type { SPFConfig } from "./page"

export function useSPFMaker() {
  const [config, setConfig] = useState<SPFConfig>({
    domain: "",
    allowMX: "-",
    allowIP: "-",
    allowHostname: "-",
    ipAddresses: "",
    serverHostnames: "",
    relayDomains: "",
    strictness: "-",
  })
  const [spfRecord, setSpfRecord] = useState("")
  const [copied, setCopied] = useState(false)

  const isValidDomain = (domain: string) => {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
    return regex.test(domain)
  }

  useEffect(() => {
    if (!isValidDomain(config.domain)) {
      setSpfRecord("")
      return
    }

    let record = "v=spf1"

    if (config.allowMX === "yes") record += " mx"
    if (config.allowIP === "yes") record += " a"
    if (config.allowHostname === "yes") record += " a"

    if (config.ipAddresses) {
      const ips = config.ipAddresses.split(" ")
      ips.forEach((ip) => {
        if (ip.trim()) record += ` ip4:${ip.trim()}`
      })
    }

    if (config.serverHostnames) {
      const hosts = config.serverHostnames.split(" ")
      hosts.forEach((host) => {
        if (host.trim()) record += ` a:${host.trim()}`
      })
    }

    if (config.relayDomains) {
      const domains = config.relayDomains.split(" ")
      domains.forEach((domain) => {
        if (domain.trim()) record += ` include:${domain.trim()}`
      })
    }

    record += config.strictness === "Strict" ? " -all" : config.strictness === "Neutral" ? " ?all" : " ~all"

    setSpfRecord(record)
  }, [config])

  const handleChange = (field: keyof SPFConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(spfRecord).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const resetForm = () => {
    setConfig({
      domain: "",
      allowMX: "-",
      allowIP: "-",
      allowHostname: "-",
      ipAddresses: "",
      serverHostnames: "",
      relayDomains: "",
      strictness: "-",
    })
    setSpfRecord("")
  }

  return {
    config,
    spfRecord,
    copied,
    handleChange,
    copyToClipboard,
    resetForm,
  }
}

