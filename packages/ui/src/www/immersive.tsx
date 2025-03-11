"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@allyson/ui/card";
import { Button } from "@allyson/ui/button";
import { Input } from "@allyson/ui/input";
import { Textarea } from "@allyson/ui/textarea";
import { Label } from "@allyson/ui/label";
import { motion, useAnimation } from "framer-motion";
import { Trash, Send, Save } from "lucide-react";
export default function Immersive() {
  const controls = useAnimation();
  const emailCardControls = useAnimation();
  const chatBubbleControls = useAnimation();

  const [ref, setRef] = useState(null);
  const [emailCardHidden, setEmailCardHidden] = useState(true);
  const emailText = `Hello James,
  
I hope this message finds you well. I am reaching out to schedule a meeting. Could you please share your availability for this week or the next?
  
Best regards,
  
Allyson`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        } else {
          controls.start("hidden");
        }
      },
      {
        threshold: 0.5, // Adjust the threshold value based on your needs
      }
    );

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [controls, ref]);

  useEffect(() => {
    let isMounted = true;

    const sequence = async () => {
      // Loop indefinitely
      while (isMounted) {
        await chatBubbleControls.start({ scale: 0, opacity: 0 });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await chatBubbleControls.start({
          scale: 1,
          opacity: 1,
          transition: {
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
            opacity: {
              duration: 0.5,
            },
            delay: 1, // Delay the start of the animation by 1 second
          },
        });
        await new Promise((resolve) => setTimeout(resolve, 4000));
        await chatBubbleControls.start({
          opacity: 0,
          scale: 0.7, // Slightly scale down for disappearance
          transition: {
            opacity: { duration: 0.5 },
            scale: {
              type: "spring",
              stiffness: 700, // Keep these the same for consistency
              damping: 20,
            },
          },
        });
        setEmailCardHidden(false);
        await emailCardControls.start({
          opacity: 1,
          scale: 0.9, // Slightly scale up for pop effect
          transition: {
            opacity: { duration: 0.5 },
            scale: {
              type: "spring",
              stiffness: 700, // Adjust stiffness for more or less "bounce"
              damping: 20, // Adjust damping for how "bouncy" it is
            },
          },
        });

        // Wait for 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));
        // Hide the card
        await emailCardControls.start({
          opacity: 0,
          scale: 0.7, // Slightly scale down for disappearance
          transition: {
            opacity: { duration: 0.5 },
            scale: {
              type: "spring",
              stiffness: 700, // Keep these the same for consistency
              damping: 20,
            },
          },
        });
        setEmailCardHidden(true);
      }
    };

    sequence();

    return () => {
      isMounted = false;
    };
  }, [emailCardControls, chatBubbleControls]);

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 }, // Adjust the y value based on your needs
  };
  const chatBubbleAnimation = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };

  const textAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    // transition: { duration: 0.5, delay: 2 } // Delay to start after bubble animation
  };
  return (
    <div className="flex md:mb-40 flex-col mt-10 items-center justify-center">
      <div className="text-center flex flex-col  md:max-w-4xl items-center justify-center">
        <h3
          style={{ fontFamily: "'ClashDisplay', sans-serif" }}
          className="text-4xl md:text-5xl lg:text-7xl font-medium text-center tracking-wider"
        >
          Not Another Boring{" "}
          <span className="text-red-500 line-through">Chatbot</span>
        </h3>
        <p className="mt-6 text-md max-w-3xl text-zinc-400">
          Our immersive mode is far more interactive than traditional chatbots
          and allows you to take action in your business at anytime.{" "}
        </p>
        <span className="font-bold mt-2">Available on iOS</span>
        <span className="mt-2 italic text-zinc-500">
          *You still have the option to use chat mode.*
        </span>
      </div>

      <div className="flex flex-row mt-10">
        <div
          // data-aos="fade-up"
          // data-aos-delay="3000"
          // data-aos-duration="1000"
          className="md:max-w-5xl w-[18rem] h-[36rem] flex flex-col items-center justify-center mx-auto border-4 border-zinc-800 p-2 bg-black rounded-[30px] md:shadow-2xl"
        >
          <div className=" flex flex-col items-center">
            {/* Chat Bubbles */}
            <div
              className={`-mt-[240px] ${emailCardHidden ? "block" : "hidden"}`}
            >
              <motion.div
                animate={chatBubbleControls}
                initial={{ scale: 0, opacity: 0 }}
                className=""
              >
                <svg
                  width="190"
                  height="237"
                  viewBox="0 0 250 237"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    fill="#27272a"
                    variants={chatBubbleAnimation}
                    initial="initial"
                    animate="animate"
                    transition={{
                      ...chatBubbleAnimation.transition,
                      delay: 0.5,
                    }}
                    d="M112.997 218.328C109.949 221.745 108.596 226.092 108.879 230.345C109.141 234.579 111.062 238.739 114.479 241.787C117.896 244.836 122.248 246.271 126.484 246.049C130.701 245.85 134.907 244.009 137.955 240.592C141.003 237.175 142.356 232.828 142.073 228.574C141.811 224.34 139.89 220.18 136.473 217.132C133.056 214.084 128.704 212.649 124.468 212.87C120.21 213.072 116.045 214.91 112.997 218.328ZM133.381 229.132C133.497 231.178 132.873 233.184 131.445 234.785C130.018 236.385 128.095 237.234 126.049 237.35C124.023 237.445 121.932 236.785 120.267 235.299C118.58 233.794 117.707 231.812 117.571 229.787C117.455 227.741 118.079 225.735 119.507 224.135C120.935 222.534 122.857 221.686 124.903 221.569C126.929 221.474 129.02 222.135 130.685 223.62C132.35 225.106 133.223 227.088 133.381 229.132Z"
                  />
                  <motion.path
                    fill="#27272a"
                    variants={chatBubbleAnimation}
                    initial="initial"
                    animate="animate"
                    transition={{
                      ...chatBubbleAnimation.transition,
                      delay: 0.8,
                    }}
                    d="M229.626 88.5192C230.843 84.1718 231.509 79.5927 231.509 74.8686C231.509 60.8992 225.916 48.176 216.873 38.9887C207.831 29.8013 195.282 24.0629 181.428 24.0919C175.603 24.0919 170.009 25.1352 164.821 26.9901C154.156 10.9629 136.071 0.355469 115.494 0.355469C99.7566 0.355469 85.4104 6.58663 74.8029 16.6724C65.7025 25.3381 59.3265 36.873 56.9789 49.857C54.6313 49.5092 52.2548 49.3063 49.7913 49.3063C36.0248 49.3063 23.5045 54.9868 14.5201 64.1452C5.56457 73.2456 0 85.9108 0 99.8222C0 117.443 8.9265 133.007 22.4612 142.049C22.4322 142.716 22.3742 143.382 22.3742 144.078C22.3742 155.062 25.6492 165.467 31.9673 173.379C35.1264 177.32 39.0969 180.624 43.7051 182.914C48.3422 185.204 53.617 186.479 59.2975 186.479C61.4422 186.479 63.5289 186.16 65.5866 185.754C68.0211 185.233 70.3687 184.566 72.3684 183.928C73.2959 185.609 74.5131 187.58 76.0202 189.609C78.1069 192.391 80.8022 195.289 84.2801 197.753C87.729 200.187 92.0473 202.129 97.0322 202.767C99.2059 203.028 101.322 203.173 103.35 203.173C114.914 203.173 124.015 199.115 130.101 195.116C132.564 193.493 134.564 191.899 136.071 190.507C137.259 191.174 138.651 191.87 140.274 192.594C145.49 194.913 152.881 197.231 161.691 197.231C163.749 197.231 165.894 197.115 168.067 196.825C178.704 195.434 189.543 190.826 198.064 183.175C202.324 179.349 205.976 174.712 208.585 169.35C210.323 165.786 211.541 161.873 212.236 157.7C212.845 157.729 213.425 157.815 214.033 157.815C223.974 157.815 233.016 153.7 239.508 147.092C246 140.513 250 131.384 250 121.356C250 106.894 241.711 94.4025 229.626 88.5192ZM231.249 138.948C226.814 143.44 220.757 146.194 214.062 146.194C212.178 146.194 210.323 145.962 208.469 145.498L201.426 143.817L201.31 151.063C201.223 155.99 200.122 160.337 198.209 164.25C195.369 170.075 190.674 174.944 185.051 178.567C179.428 182.189 172.85 184.508 166.618 185.32C164.937 185.551 163.314 185.638 161.72 185.638C154.968 185.638 149.113 183.841 144.998 181.987C142.94 181.088 141.317 180.161 140.216 179.494C139.665 179.175 139.288 178.886 139.027 178.712L138.767 178.538L138.738 178.509L134.274 175.118L130.767 179.465C130.681 179.552 128.043 182.682 123.319 185.667C118.595 188.653 111.9 191.522 103.379 191.522C101.814 191.522 100.191 191.435 98.5103 191.203C95.6411 190.855 93.2066 189.754 91.0039 188.218C87.7 185.928 85.0336 182.479 83.3237 179.581C82.4542 178.132 81.8166 176.857 81.4109 175.958C81.208 175.524 81.0631 175.176 80.9761 174.944L80.8892 174.712V174.683L78.8604 169.061L73.2959 171.292L73.2089 171.321C72.7452 171.495 70.3397 172.422 67.4704 173.292C66.0213 173.727 64.4853 174.132 63.0362 174.393C61.5871 174.683 60.2539 174.828 59.3844 174.828C55.3849 174.828 51.965 173.959 48.9219 172.48C44.4007 170.249 40.7199 166.481 38.1115 161.554C35.5031 156.627 34.025 150.541 34.025 144.049C34.025 142.687 34.141 141.267 34.3728 139.789L34.9235 135.876L31.4746 133.934C19.6789 127.297 11.6508 114.545 11.6508 99.7932C11.6508 88.9829 15.9402 79.2739 22.8959 72.2022C29.8516 65.1596 39.3578 60.8412 49.9073 60.8122C53.53 60.8122 57.0369 61.3629 60.3988 62.3483L67.2966 64.3481L67.7892 57.1895C68.6877 44.4953 74.3102 33.1633 82.889 24.9903C91.4677 16.8173 102.916 11.8614 115.581 11.8614C133.579 11.8614 149.258 21.9472 157.489 36.9599L160.126 41.7999L165.082 39.3944C170.096 36.9599 175.632 35.5978 181.515 35.5978C192.123 35.5978 201.716 39.9451 208.7 47.0457C215.685 54.1463 220.003 63.9133 220.003 74.8106C220.003 80.0854 218.96 85.0993 217.105 89.6785L214.7 95.6198L220.844 97.4167C230.959 100.373 238.494 109.908 238.465 121.298C238.407 128.254 235.683 134.456 231.249 138.948Z"
                  />
                  <motion.path
                    fill="#27272a"
                    variants={chatBubbleAnimation}
                    initial="initial"
                    animate="animate"
                    transition={{
                      ...chatBubbleAnimation.transition,
                      delay: 1.1,
                    }}
                    d="M132.858 263.545C135.277 260.834 135.011 256.649 132.264 254.199C129.516 251.748 125.329 251.959 122.91 254.671C120.491 257.382 120.757 261.567 123.505 264.017C126.252 266.468 130.44 266.257 132.858 263.545Z"
                  />
                </svg>
              </motion.div>
              <motion.div
                className="text-xs max-w-[150px] text-center text-zinc-400"
                transition={{
                  ...chatBubbleAnimation.transition,
                  delay: 1.3,
                }}
                animate={chatBubbleControls}
                initial={{ scale: 0, opacity: 0 }}
                variants={textAnimation}
                style={{
                  position: "relative",
                  top: "-51%", // Adjust these to align your text inside the bubble as desired
                  left: "10%",
                  transform: "translate(-50%, -50%)",
                  maxWidth: "150px", // Adjust based on your bubble size
                }}
              >
                I need to schedule an appointment with James Smith.
              </motion.div>
            </div>

            {/* Pulsing Circle */}
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              className={` ${
                emailCardHidden ? "block" : "hidden"
              } h-28 shadow -mt-10 w-28 rounded-full bg-gradient-to-r from-[#4CD3FF]  to-[#D573F6] p-1`}
            >
              <div className="flex h-full w-full rounded-full items-center justify-center bg-black " />
            </motion.div>
            {/* Email Card */}
            <motion.div
              animate={emailCardControls}
              initial={{
                opacity: 0,
                scale: 0,
              }}
              className={`p-6 ${emailCardHidden ? "hidden" : "block"}`}
            >
              <Card className="p-6  w-[15rem] shadow">
                <div className="flex flex-row justify-between mb-4">
                  <div className="flex flex-row space-x-2 ">
                    <div className="p-2 border border-zinc-800 rounded-md flex justify-center items-center">
                      <Trash className="h-5 w-5" color="#ef4444" />
                    </div>
                    <div className="p-2 border border-zinc-800 rounded-md flex justify-center items-center">
                      <Save className="h-5 w-5" color="#71717a" />
                    </div>
                  </div>
                  <div className="p-2 border border-zinc-800 rounded-md flex justify-center items-center">
                    <Send className="h-5 w-5" color="#71717a" />
                  </div>
                </div>
                <Label>To:</Label>
                <Input
                  readOnly={true}
                  value="james@jsmith.com"
                  className="mb-5"
                />
                <Label>Subject</Label>
                <Input
                  readOnly={true}
                  value="Meeting Availablity"
                  className="mb-5"
                />
                <Label>Email Body</Label>
                <Textarea readOnly={true} value={emailText} />
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
