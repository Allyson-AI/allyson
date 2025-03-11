// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { motion } from "framer-motion";

interface AnimatedLogoProps {
  loaderProgress: number;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ loaderProgress }) => {
  const outlineVariants = {
    hidden: {
      pathLength: 0,
      stroke: "#a1a1a1",
    },
    visible: {
      pathLength: 1,
      stroke: "#a1a1a1",
      transition: { duration: .5 },
    },
  };

  const maskVariants = {
    hidden: {
      y: "100%", // Start with mask at the bottom
    },
    visible: {
      y: "0%", // Move mask to the top
      transition: { duration: 2, delay: .5 }, // Start after the outline animation
    },
  };

  

  // Convert progress to a value suitable for the 'y' attribute
  const maskPositionY = `${100 - loaderProgress}`;

  return (
    <section className="flex h-screen flex-col justify-center items-center dark:bg-grid-white/[0.1] bg-grid-black/[0.1] p-6">
      <motion.svg
        width="1600"
        height="1600"
        className="w-[350px] h-[350px]"
        viewBox="0 0 1600 1600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M966.942 471.329C989.274 506.903 1315.79 1040.87 1325.29 1067.63C1336.11 1098.12 1316.08 1122.47 1286.97 1137.07C1266.74 1147.23 1243.01 1148.92 1121.11 1148.92C998.854 1148.92 975.668 1147.26 956.146 1137.07C938.175 1127.7 918.28 1099.78 860.798 1003.26C800.268 901.608 784.106 879.26 763.798 869.116C746.795 860.958 733.247 859.542 716.023 866.738C696.332 874.964 682.357 893.578 628.052 983.945C524.129 1156.85 536.031 1148.94 379.598 1148.94C319.867 1148.94 271.001 1147.14 271.001 1144.92C271.001 1142.71 318.207 1062.25 375.913 966.131C441.313 857.177 490.301 783.032 505.996 769.249C573.625 709.849 671.797 694.142 746.396 730.788C767.558 741.189 788.322 753.61 804.874 772.475C815.868 785.004 863.284 859.223 910.233 937.4C960.013 1020.29 990.038 1078.09 1007.8 1082.74C1027.54 1087.91 1049.26 1076.28 1053.82 1058.09C1058.39 1037.14 1026.24 988.261 883.714 751.177C787.825 591.673 704.316 453.792 702.765 451C702.765 451 758.718 451 825.941 451H954.933L966.942 471.329Z"
          variants={outlineVariants}
          initial="hidden"
          animate="visible"
        />
        <defs>
          <linearGradient
            id="logoGradient"
            x1="799.633"
            y1="451"
            x2="799.633"
            y2="1149"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#a1a1aa" />
            <stop offset="75%" stopColor="#a1a1aa" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <mask id="fadeMask">
          <motion.rect
            x="0"
            y={maskPositionY}
            width="1600"
            height="1600"
            fill="#fff"
            variants={maskVariants}
            initial="hidden"
            animate="visible"
          />
        </mask>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M966.942 471.329C989.274 506.903 1315.79 1040.87 1325.29 1067.63C1336.11 1098.12 1316.08 1122.47 1286.97 1137.07C1266.74 1147.23 1243.01 1148.92 1121.11 1148.92C998.854 1148.92 975.668 1147.26 956.146 1137.07C938.175 1127.7 918.28 1099.78 860.798 1003.26C800.268 901.608 784.106 879.26 763.798 869.116C746.795 860.958 733.247 859.542 716.023 866.738C696.332 874.964 682.357 893.578 628.052 983.945C524.129 1156.85 536.031 1148.94 379.598 1148.94C319.867 1148.94 271.001 1147.14 271.001 1144.92C271.001 1142.71 318.207 1062.25 375.913 966.131C441.313 857.177 490.301 783.032 505.996 769.249C573.625 709.849 671.797 694.142 746.396 730.788C767.558 741.189 788.322 753.61 804.874 772.475C815.868 785.004 863.284 859.223 910.233 937.4C960.013 1020.29 990.038 1078.09 1007.8 1082.74C1027.54 1087.91 1049.26 1076.28 1053.82 1058.09C1058.39 1037.14 1026.24 988.261 883.714 751.177C787.825 591.673 704.316 453.792 702.765 451C702.765 451 758.718 451 825.941 451H954.933L966.942 471.329Z"
          fill="url(#logoGradient)" // Apply gradient fill here
          mask="url(#fadeMask)"
        />
        
      </motion.svg>
      <p className="text-zinc-400 -mt-10">Loading...</p>
    </section>
  );
};

export default AnimatedLogo;
