"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 py-20 px-4 max-w-7xl mx-auto">
      {/* Left: Text */}
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Learn Without Limits.
          <br className="hidden md:block" />
          Grow Your Knowledge.
        </h1>
        <p className="text-lg text-gray-600">
          Discover industry-standard courses designed to equip you with
          in-demand skills and empower your future.
        </p>
        <Button size="lg">Browse Courses</Button>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6 text-center mt-8">
          <div>
            <span className="text-2xl font-bold">50+</span>
            <br />
            Programs
          </div>
          <div>
            <span className="text-2xl font-bold">200+</span>
            <br />
            Teachers
          </div>
          <div>
            <span className="text-2xl font-bold">5k+</span>
            <br />
            Students
          </div>
        </div>
      </div>

      {/* Right: Illustration/Image */}
      <div className="flex-1">
        <Image
          src="/hero-illustration.png"
          alt="Students learning"
          width={600}
          height={400}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}
