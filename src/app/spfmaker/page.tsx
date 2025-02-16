import { CheckCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import SPFMaker from "./form";

const needSPF = [
  {
    title: " Prevent Email Spoofing",
  },
  {
    title: " Improve Email Deliverability",
  },
  {
    title: " Protect Your Domain’s Reputation",
  },
  {
    title: " Authenticate Your Email Traffic",
  },
  {
    title: "Compliance with Anti-Spam Policies ",
  },
];

export const page = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <SPFMaker />
      <div className="my-16">
        <section>
          <h2 className="font-bold text-2xl md:text-3xl mb-2 ">
            What is an SPF Record?
          </h2>
          <p className="text-base text-gray-700 ">
            An SPF (Sender Policy Framework) record is a DNS (Domain Name
            System) record that helps prevent email spoofing by specifying which
            mail servers are allowed to send emails on behalf of your domain. It
            is a type of email authentication method that allows the receiving
            mail server to verify if an email claiming to come from your domain
            is being sent by an authorized server.
          </p>
        </section>
        <section className="space-y-">
          <h2 className="font-bold text-2xl md:text-3xl mb-2">
            What information is found in an SPF Record?
          </h2>
          <p className="text-base text-gray-700 ">
            Here’s a summary of the key information found in an SPF record, in
            points:
          </p>
          <li className="flex items-center space-x-2">
            <CheckCircledIcon className="text-violet-500 w-5 h-5 flex-shrink-0 " />
            <span>
              <strong>Version (v):</strong>Specifies the SPF version being used
              (e.g., spf1).
            </span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircledIcon className="text-violet-500 w-5 h-5 flex-shrink-0 " />
            <span>
              <strong>Mechanisms: </strong> Define authorized senders:
            </span>
          </li>
          <ul className="list-disc list-inside">
            <li>
              {" "}
              <strong>ip4 / ip6: </strong>Specifies allowed IP addresses.
            </li>
            <li>
              {" "}
              <strong>a: </strong>Allows domain&apos A record IP.
            </li>
            <li>
              <strong>mx:</strong> Allows domain&apos mail exchange servers.
            </li>
            <li>
              <strong>include: </strong>Includes SPF record of another domain.
            </li>
            <li>
              {" "}
              <strong>include:</strong> Includes SPF record of another domain.
            </li>
            <li>
              {" "}
              <strong>all: </strong>A catch-all for all senders (usually at the
              end).
            </li>
          </ul>
          <li className="flex items-center space-x-2">
            <CheckCircledIcon className="text-violet-500 w-5 h-5 flex-shrink-0" />
            <span>
              <strong> Qualifiers:</strong> Define the result of a match:
            </span>
          </li>
          <ul className="list-disc list-inside">
            <li>+: Pass (default).</li>
            <li>-: Fail (hard fail).</li>
            <li>~: SoftFail (soft fail).</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-bold text-2xl md:text-3xl">
            Why do I need an SPF record for my domain?
          </h2>
          <ul>
            {needSPF.map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                <CheckCircledIcon className="text-violet-500 w-5 h-5 flex-shrink-0" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-3">
          <h2 className="font-bold text-2xl md:text-3xl mb-2">
            What should i do after generating an SPF Record?
          </h2>
          <span>
            <li>
              <strong>Add SPF to DNS: </strong>Log in to your domain provider,
              create a TXT record, and paste the generated SPF value.
            </li>
            <li>
              <strong>Verify & Test: </strong>Use MXToolbox or nslookup
              -type=TXT yourdomain.com to check propagation, then send a test
              email.
            </li>
            <li>
              <strong>Verify & Test: </strong>Use MXToolbox or nslookup
              -type=TXT yourdomain.com to check propagation, then send a test
              email.
            </li>
          </span>
        </section>
      </div>
    </div>
  );
};
export default page;
