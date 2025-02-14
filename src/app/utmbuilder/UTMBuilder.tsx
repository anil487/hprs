"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { CopyIcon, ResetIcon } from "@radix-ui/react-icons"

export interface UTMParams {
  url: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
}

export default function UTMBuilder() {
  const [params, setParams] = useState<UTMParams>({
    url: "",
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
  })

  const [builtUrl, setBuiltUrl] = useState<string>("")

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParams((prev) => ({ ...prev, [name]: value }))
  }, [])

  useEffect(() => {
    const utmParams = new URLSearchParams({
      ...(params.source && { utm_source: params.source }),
      ...(params.medium && { utm_medium: params.medium }),
      ...(params.campaign && { utm_campaign: params.campaign }),
      ...(params.term && { utm_term: params.term }),
      ...(params.content && { utm_content: params.content }),
    }).toString()

    const newUrl = params.url ? `${params.url}${params.url.includes("?") ? "&" : "?"}${utmParams}` : utmParams
    setBuiltUrl(newUrl)
  }, [params])

  const copyUrl = useCallback(() => {
    if (builtUrl) {
      navigator.clipboard
        .writeText(builtUrl)
        .then(() => {
          toast({
            title: "URL Copied",
            description: "The Final UTM Link has been copied to your clipboard.",
          })
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
          toast({
            title: "Copy Failed",
            description: "Failed to copy the Final UTM Link. Please try again.",
            variant: "destructive",
          })
        })
    }
  }, [builtUrl])

  const clearForm = useCallback(() => {
    setParams({
      url: "",
      source: "",
      medium: "",
      campaign: "",
      term: "",
      content: "",
    })
    setBuiltUrl("")
  }, [])

  return (
    <div className="mx-auto my-8 md:my-24 max-w-4xl">
      <div className="space-y-8 shadow-lg rounded-md p-6 md:p-12">
        <div className="text-center">
          <h2 className="font-medium text-xl md:text-2xl">UTM URL BUILDER</h2>
        </div>
        <div className="grid gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <Label htmlFor="url" className="w-full md:w-1/6">
              Website URL
              <span className="text-red-600">*</span>
            </Label>
            <Input
              id="url"
              name="url"
              value={params.url}
              onChange={handleInputChange}
              className="w-full md:w-5/6"
              placeholder="https://example.com"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <Label htmlFor="source" className="w-full md:w-1/6">
              Campaign Source
            </Label>
            <Input
              id="source"
              name="source"
              value={params.source}
              onChange={handleInputChange}
              className="w-full md:w-5/6"
              placeholder="referrer: google, facebook"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <Label htmlFor="medium" className="w-full md:w-1/6">
              Campaign Medium
            </Label>
            <Input
              id="medium"
              name="medium"
              value={params.medium}
              onChange={handleInputChange}
              className="w-full md:w-5/6"
              placeholder="Marketing Medium: cpc, banner, email, social"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <Label htmlFor="campaign" className="w-full md:w-1/6">
              Campaign Name
            </Label>
            <Input
              id="campaign"
              name="campaign"
              value={params.campaign}
              onChange={handleInputChange}
              className="w-full md:w-5/6"
              placeholder="spring_sale, product, promo code, slogan"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <Label htmlFor="term" className="w-full md:w-1/6">
              Campaign Term
            </Label>
            <Input
              id="term"
              name="term"
              value={params.term}
              onChange={handleInputChange}
              className="w-full md:w-5/6"
              placeholder="running get heavy discount"
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <Label htmlFor="content" className="w-full md:w-1/6">
              Campaign Content
            </Label>
            <Input
              id="content"
              name="content"
              value={params.content}
              onChange={handleInputChange}
              className="w-full md:w-5/6"
              placeholder="logolink"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-normal">Your Generated URL</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Input readOnly value={builtUrl} placeholder="Your UTM URL will appear here" className="flex-grow" />
            <Button
              className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700"
              onClick={copyUrl}
              disabled={!builtUrl}
            >
              Copy Link
              <CopyIcon className="mr-2" />
              
            </Button>
            <Button variant="outline" onClick={clearForm} className="w-full md:w-auto">
              <ResetIcon className="mr-2" />

            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

