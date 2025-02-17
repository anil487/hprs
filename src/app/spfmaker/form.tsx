"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { ResetIcon } from "@radix-ui/react-icons";

type SPFConfig = {
  domain: string;
  allowMX: string;
  allowIP: string;
  allowHostname: string;
  ipAddresses: string;
  serverHostnames: string;
  relayDomains: string;
  strictness: string;
};

const initialConfig: SPFConfig = {
  domain: "",
  allowMX: "-",
  allowIP: "-",
  allowHostname: "-",
  ipAddresses: "",
  serverHostnames: "",
  relayDomains: "",
  strictness: "-",
};

export function SPFMaker() {
  const [config, setConfig] = useState<SPFConfig>(initialConfig);
  const [spfRecord, setSpfRecord] = useState("");

  const isValidDomain = (domain: string) => {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return regex.test(domain);
  };

  useEffect(() => {
    if (!isValidDomain(config.domain)) {
      setSpfRecord("");
      return;
    }

    let record = "v=spf1";

    if (config.allowMX === "yes") record += " mx";
    if (config.allowIP === "yes") record += " a";
    if (config.allowHostname === "yes") record += " a";

    if (config.ipAddresses) {
      const ips = config.ipAddresses.split(" ");
      ips.forEach((ip) => {
        if (ip.trim()) record += ` ip4:${ip.trim()}`;
      });
    }

    if (config.serverHostnames) {
      const hosts = config.serverHostnames.split(" ");
      hosts.forEach((host) => {
        if (host.trim()) record += ` a:${host.trim()}`;
      });
    }

    if (config.relayDomains) {
      const domains = config.relayDomains.split(" ");
      domains.forEach((domain) => {
        if (domain.trim()) record += ` include:${domain.trim()}`;
      });
    }

    record +=
      config.strictness === "Strict"
        ? " -all"
        : config.strictness === "Neutral"
        ? " ?all"
        : " ~all";
    setSpfRecord(record);
  }, [config]);

  const handleChange = (field: keyof SPFConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(spfRecord);
      alert("SPF record copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleReset = () => {
    setConfig(initialConfig);
    setSpfRecord("");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center mb-5">
            SPF Record Generator
          </CardTitle>
          <CardDescription>
            Ensure flawless email delivery and safeguard against spam with our
            SPF Record Generator. This essential tool creates a customized SPF
            record for your domain, which you can easily add to your DNS
            settings as a TXT record. Prevent unauthorized use of your domain
            and maintain your email&apos integrity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-6">
            <Label>Generated SPF record:</Label>
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <Input
                value={spfRecord}
                readOnly
                className="bg-slate-100 font-mono text-sm flex-grow"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  className="flex-grow sm:flex-grow-0 bg-blue-500 hover:bg-blue-800"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-grow sm:flex-grow-0"
                >
                  <ResetIcon />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              (copy and paste in your DNS as a TXT record)
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Label className="w-72">Your domain name:</Label>
              <Input
                placeholder="Please enter your valid domain name"
                value={config.domain}
                onChange={(e) => handleChange("domain", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-72">Allow servers listed as MX:</Label>
              <Select
                value={config.allowMX}
                onValueChange={(value) => handleChange("allowMX", value)}
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

            <div className="flex items-center gap-4">
              <Label className="w-72">
                Allow current IP address of domain:
              </Label>
              <Select
                value={config.allowIP}
                onValueChange={(value) => handleChange("allowIP", value)}
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

            <div className="flex items-center gap-4">
              <Label className="w-72">Allow any hostname ending in:</Label>
              <Select
                value={config.allowHostname}
                onValueChange={(value) => handleChange("allowHostname", value)}
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

            <div className="flex items-center gap-4">
              <Label className="w-72">IP addresses in CIDR format:</Label>
              <Input
                placeholder="i.e: 10.0.0.1/32 192.168.0.1/28"
                value={config.ipAddresses}
                onChange={(e) => handleChange("ipAddresses", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-72">Other server hostnames</Label>
              <Input
                placeholder="i.e: ns1.stablecluster.com"
                value={config.serverHostnames}
                onChange={(e) =>
                  handleChange("serverHostnames", e.target.value)
                }
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-72">Domains that may relay mail:</Label>
              <Input
                placeholder="i.e: newsletter-domain.com mailer-domain.com"
                value={config.relayDomains}
                onChange={(e) => handleChange("relayDomains", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-72">Strictness of SPF enforcement:</Label>
              <Select
                value={config.strictness}
                onValueChange={(value) => handleChange("strictness", value)}
              >
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
  );
}
export default SPFMaker;
