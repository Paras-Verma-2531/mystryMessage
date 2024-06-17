"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import messageData from "@/messages.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React from "react";
import Autoplay from "embla-carousel-autoplay";
function Home() {
  return (
    <>
      <main className=" flex flex-col items-center justify-center px-4 md:px-24 
       bg-gray-800 text-white min-h-screen">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            mystryMessage - Where your identity is shrouded in mystery.
          </p>
        </section>
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messageData.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-auto items-center justify-center p-6">
                      <span className="text-lg font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      {/* footer section */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        {`© ${new Date().getFullYear()} mystryMessage. All rights reserved.`}
      </footer>
    </>
  );
}

export default Home;
