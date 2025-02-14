import UTMBuilder from "./UTMBuilder";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const UTMparameters = [
  {
    Parameter: "utm_source",
    Purpose: "Identifies the traffic source (e.g., Google, Facebook, Twitter)",
    required: "true",
  },
  {
    Parameter: "utm_medium",
    Purpose: "Identifies the marketing medium (e.g., email, social, CPC)",
    required: "true",
  },
  {
    Parameter: "utm_campaign",
    Purpose: "Identifies the campaign name (e.g., summer_sale, new_product)",
    required: "true",
  },
  {
    Parameter: "utm_term",
    Purpose: "(Optional) Identifies the paid search keyword",
    required: "false",
  },
  {
    Parameter: "utm_content",
    Purpose: "(Optional) Differentiates ads or links within the same campaign",
    required: "false",
  },
];

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col justify-center text-center my-16">
        <h2 className="text-3xl md:text-5xl font-medium mb-2">
          UTM Builder for Google
        </h2>
        <h2 className="text-3xl md:text-5xl font-medium mb-4">
          Tracking Codes
        </h2>
        <p className="font-normal text-sm">
          Create and manage your UTM codes easily with our UTM Builder tool.
        </p>
      </div>
      <div className="hidden lg:block absolute -left-10 top-1/2 transform -translate-y-1/2">
        <Image
          src={"/left.png"}
          alt="leftside"
          width={411}
          height={381}
          
        />
      </div>
      <div className="hidden lg:block absolute -right-0 top-1/2 transform -translate-y-1/2">
        <Image
          src={"/right.png"}
          alt="rightside"
          width={411}
          height={381}
          
        />
      </div>

      <UTMBuilder />

      <div className="mt-16">
        <section className="mb-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-2">
            What is a UTM Builder?
          </h2>
          <p className="text-base text-gray-700">
            A UTM Builder is a tool used to create trackable URLs by adding UTM
            parameters to a base URL. These UTM parameters help marketers and
            businesses track where their website traffic is coming from in tools
            like Google Analytics.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-2">
            What are UTM Parameters?
          </h2>
          <p className="text-base text-gray-700 mb-4">
            UTM parameters are special tags added to a URL to track marketing
            campaigns. The most common UTM parameters are:
          </p>
          <div className="overflow-x-auto">
            <Table className="w-full border rounded-md">
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Parameter</TableHead>
                  <TableHead className="font-bold">Required</TableHead>
                  <TableHead className="font-bold">Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {UTMparameters.map((parameters) => (
                  <TableRow key={parameters.Parameter}>
                    <TableCell className="font-medium">
                      {parameters.Parameter}
                    </TableCell>
                    <TableCell>{parameters.required}</TableCell>
                    <TableCell>{parameters.Purpose}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-2">
            Why is a UTM Builder Important?
          </h2>
          <ul className="list-disc list-inside text-base text-gray-700">
            <li>
              Helps understand which sources, campaigns, and ads bring the most
              visitors.
            </li>
            <li>
              Marketers can track which campaigns are successful and which need
              improvement.
            </li>
            <li>Enables better decision-making based on real data.</li>
            <li>
              Understand where visitors are coming from and which channels
              convert better.
            </li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-2">
            Who Uses UTM Builders?
          </h2>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <CheckCircledIcon className="text-violet-500 w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Digital Marketers</strong> – To track campaign
                performance.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircledIcon className="text-violet-500 w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Social Media Managers</strong> – To track link clicks
                from different social platforms.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircledIcon className="text-violet-500 w-5 h-5 flex-shrink-0" />
              <span>
                <strong>SEO & PPC Experts</strong> – To analyze paid ad
                performance.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircledIcon className="text-violet-500 w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Content Creators</strong> – To track blog promotions.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircledIcon className="text-violet-500 w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Businesses & Startups</strong> – To monitor website
                traffic sources.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
