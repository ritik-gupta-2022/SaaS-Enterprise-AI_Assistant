import '../../Home.css'
import { motion } from "framer-motion";

const BrandSlide = () => {
  return (
    <div className="pt-8 bg-white px-4 md:p-12 flex justify-center">
      <div className="overflow-hidden [mask-img:linear-gradient(to_right,transparent,black,transparent)]  w-[1200px]"
       style={{
        maskImage: "linear-gradient(to right, transparent, black, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black, transparent)",
      }}
      >
        <motion.div
          className="flex gap-14 flex-none items-center justify-center pr-14"
          animate={{
            translateX: "-50%",
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          <img src={"/assests/logo-acme.png"} alt="logo_acme" className="h-8 w-auto" />
          <img src={"/assests/logo-apex.png"} alt="logo_apex" className="h-8 w-auto" />
          <img src={"/assests/logo-celestial.png"} alt="logo_celestial" className="h-8 w-auto" />

          <img src={"/assests/logo-echo.png"} alt="logo_echo" className="h-8 w-auto" />
          <img src={"/assests/logo-pulse.png"} alt="logo_pulse" className="h-8 w-auto" />
          <img src={"/assests/logo-quantum.png"} alt="logo_quantum" className="h-8 w-auto" />

          <img src={"/assests/logo-acme.png"} alt="logo_acme" className="h-8 w-auto" />
          <img src={"/assests/logo-apex.png"} alt="logo_apex" className="h-8 w-auto" />
          <img src={"/assests/logo-celestial.png"} alt="logo_celestial" className="h-8 w-auto" />

          <img src={"/assests/logo-acme.png"} alt="logo_acme" className="h-8 w-auto" />
          <img src={"/assests/logo-apex.png"} alt="logo_apex" className="h-8 w-auto" />
          <img src={"/assests/logo-celestial.png"} alt="logo_celestial" className="h-8 w-auto" />
        </motion.div>
      </div>
    </div>
  );
};

export default BrandSlide;
