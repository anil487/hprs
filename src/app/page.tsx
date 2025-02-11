"use client";
import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BiReset } from "react-icons/bi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-select";

type PlanNode = {
  name: string;
};

type HostingDetails = {
  price: number;
  plan: {
    nodes: PlanNode[];
  };
  link: string;
};

type Hosting = {
  id: string;
  title: string;
  hostingDetails: HostingDetails;
};

type HostingEdge = {
  node: Hosting;
};

const inter = Inter({ weight: "400", subsets: ["latin"] });

const query = `
  query {
    hostings(first: 40) {
      edges {
        node {
          id
          title
          hostingDetails {
            plan {
              nodes {
                name
              }
            }
            price
            link
          }
        }
      }
    }
  }
`;

const Home = () => {
  const [uniquePlans, setUniquePlans] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedTraffic, setSelectedTraffic] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [recommendedPlans, setRecommendedPlans] = useState<Hosting[]>([]);
  const [loading, setLoading] = useState(false);

  const budgets = [
    { range: "250-2k", min: 250, max: 2000 },
    { range: "1.9k-4k", min: 1900, max: 4000 },
    { range: "3.9k-8k", min: 3900, max: 8000 },
    { range: "7.9k-16k", min: 7900, max: 16000 },
  ];

  const trafficflow = [
    { range: "1k-5k", min: 1000, max: 5000 },
    { range: "6k-10k", min: 6000, max: 10000 },
    { range: "11k-20k", min: 11000, max: 20000 },
    { range: "21k-60k", min: 21000, max: 60000 },
  ];

  const resetForm = () => {
    setSelectedPlan("");
    setSelectedBudget("");
    setSelectedTraffic("");
    setSubmitted(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await fetch("https://blog.stablecluster.com/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal,
        });
        const data = await response.json();
        const plansSet = new Set<string>();
        data.data.hostings.edges.forEach((edge: HostingEdge) =>
          edge.node.hostingDetails.plan.nodes.forEach((plan) =>
            plansSet.add(plan.name)
          )
        );
        setUniquePlans(Array.from(plansSet));
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== "AbortError") {
            console.error("Failed to fetch data:", error);
          }
        } else {
          console.error("An unknown error occurred:", error);
        }
      }

      return () => controller.abort();
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch("https://blog.stablecluster.com/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal,
      });
      const data = await response.json();
      const nodes: Hosting[] = data.data.hostings.edges.map(
        (edge: HostingEdge) => edge.node
      );

      const selectedPlanNodes = nodes.filter((hosting) =>
        hosting.hostingDetails.plan.nodes.some(
          (node) => node.name === selectedPlan
        )
      );

      selectedPlanNodes.sort(
        (a, b) => a.hostingDetails.price - b.hostingDetails.price
      );

      let recommendedPlan;

      if (selectedTraffic === "1k-5k" && selectedBudget === "250-2k") {
        recommendedPlan = selectedPlanNodes[0];
      } else {
        const [budgetMin, budgetMax] = selectedBudget
          .split("-")
          .map((value) => parseInt(value.replace("k", "000")));
        const [trafficMax] = selectedTraffic
          .split("-")
          .map((value) => parseInt(value.replace("k", "000")));

        if (trafficMax > budgetMax) {
          recommendedPlan = selectedPlanNodes[selectedPlanNodes.length - 1];
        } else if (budgetMax > trafficMax) {
          const midIndex = Math.floor(selectedPlanNodes.length / 2);
          recommendedPlan = selectedPlanNodes[midIndex];
        } else {
          recommendedPlan = selectedPlanNodes.find(
            (plan) =>
              plan.hostingDetails.price >= budgetMin &&
              plan.hostingDetails.price <= budgetMax
          );
        }
      }

      setRecommendedPlans(recommendedPlan ? [recommendedPlan] : []);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getProjectType = (plan: string) => {
    if (plan.includes("Woocommerce Hosting")) return "Woocommerce Store";
    if (plan.includes("Ecommerce Hosting")) return "Ecommerce Platform";
    if (plan.includes("Node Hosting")) return "Node.js App";
    if (plan.includes("Business Email Hosting")) return "Business Website";
    if (plan.includes("Python Hosting")) return "Django App";
    if (plan.includes("Blog Hosting")) return "Blogging";
    return null;
  };

  return (
    <section className="flex items-center justify-center min-h-screen w-full bg-white p-4 md:p-0 md:relative">
      <div className="hidden md:block absolute -left-10 top-1/2 transform -translate-y-1/2">
        <Image
          src={"/left.png"}
          alt="leftside"
          width={411}
          height={381}
          className="h-96"
        />
      </div>
      <div className="hidden md:block absolute -right-0 top-1/2 transform -translate-y-1/2">
        <Image
          src={"/right.png"}
          alt="rightside"
          width={411}
          height={381}
          className="h-96"
        />
      </div>
      <div className="w-full max-w-4xl mx-60 flex flex-col md:flex-row md:items-stretch md:justify-center relative">
        <div
          className={`w-full  md:w-1/2 p-4 bg-[#FFFFFF] border-[0.25px] border-[#000000] drop-shadow-sm ${
            submitted
              ? "rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              : "rounded-xl"
          } flex flex-col transition-all duration-300 ease-in-out hover:border hover:border-black`}
        >
          <span
            className={`${inter.className} font-mono text-xs mb-2 md:mb-0 md:font-light md:text-lg lg:font-medium lg:text-2xl lg:mb-5 mt-15`}
          >
            Choose your Requirements
          </span>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between flex-grow"
          >
            <div>
              <div className="mb-2 md:mb-5">
                <label
                  htmlFor="hosting-plan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Choose Your Project Type
                </label>
                <Select
                  onValueChange={(value) => setSelectedPlan(value)}
                  value={selectedPlan}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Project" />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto h-32">
                    <SelectGroup>
                      <SelectLabel>Select Your project</SelectLabel>
                      {uniquePlans
                        .filter((plan) => plan !== null)
                        .map((plan, index) => {
                          const projectType = getProjectType(plan);
                          return projectType ? (
                            <SelectItem key={index} value={plan}>
                              {projectType}
                            </SelectItem>
                          ) : null;
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-2 md:mb-5">
                <label
                  htmlFor="hosting-plan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Choose Your Traffic Range
                </label>
                <Select
                  onValueChange={(value) => setSelectedTraffic(value)}
                  value={selectedTraffic}
                  disabled={!selectedPlan}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select traffic Range" />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto h-32">
                    <SelectGroup>
                      <SelectLabel>Select Your Traffic Range</SelectLabel>
                      {trafficflow.map((traffic, index) => (
                        <SelectItem key={index} value={traffic.range}>
                          {traffic.range}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-2 md:mb-5">
                <label
                  htmlFor="hosting-plan"
                  className=" block text-sm font-medium text-gray-700 mb-1"
                >
                  Choose your budget Range
                </label>
                <Select
                  onValueChange={(value) => setSelectedBudget(value)}
                  value={selectedBudget}
                  disabled={!selectedTraffic}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Budget Range" />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto h-32">
                    <SelectGroup>
                      <SelectLabel>
                        Select Your Monthly Budget Range
                      </SelectLabel>
                      {budgets.map((budget, index) => (
                        <SelectItem key={index} value={budget.range}>
                          {budget.range}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className={`font-thin text-xs md:font-light md:text-sm lg:font-medium lg:text-xl ${
                  submitted
                    ? "bg-white text-black hover:bg-white border-2 border-[#000000]"
                    : "bg-[#0556F3] text-white hover:bg-blue-500"
                }`}
                disabled={
                  loading ||
                  !selectedPlan ||
                  !selectedTraffic ||
                  !selectedBudget
                }
              >
                {loading ? "Loading..." : "Get Your Plan"}
              </Button>
            </div>
          </form>
        </div>

        {submitted && (
          <div className="w-full md:w-1/2 p-4 bg-[#FFFFFF] border-x border-b border-r md:border-l-0 border-[#000000] md:border-y md:border-r drop-shadow-sm md:rounded-r-xl md:rounded-bl-none flex flex-col ">
            <span
              className={`${inter.className} font-light text-lg lg:font-medium lg:text-2xl text-center mb-2`}
            >
              Our Suggested Plan
            </span>
            <div>
              {recommendedPlans.length > 0 ? (
                recommendedPlans.map((plan) => (
                  <div key={plan.id} className="flex flex-col items-center">
                    <span className="font-light text-xl md:text-2xl lg:font-medium lg:text-5xl text-center mt-12">
                      {plan.title}
                    </span>
                    <span className="font-extralight text-base lg:font-normal lg:text-3xl mt-4 text-center">
                      NPR: {plan.hostingDetails.price}/ Monthly
                    </span>
                    <div className="w-full mt-20 flex flex-col md:flex-row items-center justify-center md:justify-end space-y-4 md:space-y-0 md:space-x-4">
                      <a
                        href={plan.hostingDetails.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto"
                      >
                        <Button className="w-full md:w-auto font-thin text-xs md:font-extralight md:text-sm bg-[#0556F3] lg:font-medium lg:text-[20px] hover:bg-blue-500">
                          Add to Cart
                        </Button>
                      </a>
                      <BiReset
                        onClick={resetForm}
                        className="h-10 w-full md:w-12 p-2 rounded-md text-white bg-[#4CAF50] hover:bg-[#45a049] cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No plans match your criteria.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default Home;
