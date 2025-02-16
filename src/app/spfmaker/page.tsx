"use client"

import { useSPFMaker } from "./spfmaker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyIcon, ResetIcon } from "@radix-ui/react-icons"

export type SPFConfig = {
  domain: string
  allowMX: string
  allowIP: string
  allowHostname: string
  ipAddresses: string
  serverHostnames: string
  relayDomains: string
  strictness: string
}

export default function SPFMaker() {
  const { config, spfRecord, copied, handleChange, copyToClipboard, resetForm } = useSPFMaker()

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center justify-center text-5xl font-bold mb-20">SPF MAKER</div>
      <Card>
        <CardHeader>
          
          <CardDescription>
            Ensure flawless email delivery and safeguard against spam with our SPF Record Generator. This essential tool
            creates a customized SPF record for your domain, which you can easily add to your DNS settings as a TXT
            record. Prevent unauthorized use of your domain and maintain your email&apos;s integrity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-6">
            <Label>Generated SPF record:</Label>
            <div className="flex items-center gap-2">
              <Input value={spfRecord} readOnly className="bg-muted font-mono text-sm flex-1" />
              <Button onClick={copyToClipboard} className="bg-blue-500 text-white hover:bg-blue-800">
                <CopyIcon />
              </Button>
              <Button onClick={resetForm} className="bg-gray-50 text-black hover:bg-gray-100">
                <ResetIcon />
              </Button>
            </div>
            <div>
              {copied && <p className="text-green-600 mb-2">SPF record copied!</p>}
              <p className="text-sm text-muted-foreground mt-1">(copy and paste in your DNS as a TXT record)</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Label className="w-full sm:w-72">Your domain name:</Label>
              <Input
                placeholder="i.e stablecluster.com"
                value={config.domain}
                onChange={(e) => handleChange("domain", e.target.value)}
                className="w-full"
              />
            </div>

            {[
              { label: "Allow servers listed as MX", field: "allowMX" },
              { label: "Allow current IP address of domain", field: "allowIP" },
              { label: "Allow any hostname ending in", field: "allowHostname" },
            ].map(({ label, field }) => (
              <div key={field} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-full sm:w-72">{label}:</Label>
                <Select
                  value={config[field as keyof SPFConfig]}
                  onValueChange={(value) => handleChange(field as keyof SPFConfig, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">-</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}

            {[
              {
                label: "IP addresses in CIDR format",
                field: "ipAddresses",
                placeholder: "i.e: 10.0.0.1/32 192.168.0.1/28",
              },
              { label: "Other server hostnames", field: "serverHostnames", placeholder: "i.e: ns1.stablecluster.com" },
              {
                label: "Domains that may relay mail",
                field: "relayDomains",
                placeholder: "i.e: newsletter-domain.com mailer-domain.com",
              },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-full sm:w-72">{label}:</Label>
                <Input
                  placeholder={placeholder}
                  value={config[field as keyof SPFConfig]}
                  onChange={(e) => handleChange(field as keyof SPFConfig, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Label className="w-full sm:w-72">Strictness of SPF enforcement:</Label>
              <Select value={config.strictness} onValueChange={(value) => handleChange("strictness", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">-</SelectItem>
                  <SelectItem value="Strict">Strict (Fail)</SelectItem>
                  <SelectItem value="Soft">Soft Fail</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

