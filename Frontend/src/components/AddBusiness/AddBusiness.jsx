import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Card, CardContent } from "../ui/card"
import { Progress } from "../ui/progress"

import { Loader2, SkipForward, ArrowRight, Sparkles } from "lucide-react"

const AnimatedText = ({ children, delay = 0 }) => (
  <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
    {children}
  </motion.span>
)

const SparkleEffect = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.5 }}
  >
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: Math.random() * 2,
        }}
      >
        <Sparkles className="text-yellow-400" size={16} />
      </motion.div>
    ))}
  </motion.div>
)

const FormStep = ({ question, value, onChange, onNext, onSkip, isFirst, canSkip,isTextarea }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

return (
    <motion.div
        ref={ref}
        initial={{ y: 50, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="space-y-6"
    >
        <motion.h2
            className="text-3xl font-bold text-primary"
            initial={{ x: -20, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            <AnimatedText>{question}</AnimatedText>
        </motion.h2>
        {!isTextarea ? (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <Input
                    value={value}
                    onChange={onChange}
                    className="text-xl p-6 border-2 border-primary focus:ring-4 focus:ring-primary/20 bg-white/50 backdrop-blur-sm transition-all duration-300 ease-in-out hover:shadow-lg"
                />
            </motion.div>
        ) : (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <Textarea
                    value={value}
                    onChange={onChange}
                    className="text-xl p-6 border-2 border-primary focus:ring-4 focus:ring-primary/20 bg-white/50 backdrop-blur-sm transition-all duration-300 ease-in-out hover:shadow-lg"
                    rows={6}
                />
            </motion.div>
        )}
        <motion.div
            className="flex gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
            <Button
                onClick={onNext}
                disabled={!value?.trim()}
                className={`flex-1 text-xl py-8 relative overflow-hidden group ${
                    !value?.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#7E75B8]'
                }`}
                style={{ backgroundColor: "#c0bbe5" }}
            >
                <span className="relative z-10 flex items-center justify-center">
                    <AnimatedText delay={0.5}>{isFirst ? "Enter your business details!" : "Next"}</AnimatedText>
                    <ArrowRight className="ml-2 h-5 w-5" />
                </span>
                <motion.div
                    className="absolute inset-0 bg-indigo-600"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            </Button>
        </motion.div>
    </motion.div>
)
}

const AddBusiness = () => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    businessUrl: "",
    description: "",
    businessEmail: "",
    contactNo: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [progress, setProgress] = useState(0)

  const questions = [
      { text: "What's the name of your groundbreaking business?", key: "name", required: true },
      { text: "Share the url of your business.", key: "businessUrl", required: true },
    { text: "Description of your business?", key: "description", required: true,isTextarea:true},
    { text: "What is the business email?", key: "businessEmail", required: true},
    { text: "What is the business contact number?", key: "contactNo", required: true},
  ]

  const handleNext = () => {

    if (step === questions.length - 1) {
      setIsLoading(true)
      console.log("Collected Form Data:", formData)
      setTimeout(() => {
        setIsLoading(false)
        setIsSubmitted(true)
        setProgress(100)
      }, 2000)
    } else {
      setStep(step + 1)
      setProgress(((step + 1) / questions.length) * 100)
    }
  }

  const handleSkip = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
      setProgress(((step + 1) / questions.length) * 100)
    }
  }

  const handleReset = () => {
    setStep(0)
    setFormData({ name: "", businessUrl: "", description: "", businessEmail: "", contactNo: "" })
    setIsSubmitted(false)
    setProgress(0)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStep(0)
      setProgress(0)
    }, 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="min-h-screen w-full p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-2xl bg-white/80 backdrop-blur-md">
        <CardContent className="p-8 relative min-h-[600px] flex flex-col justify-center">
          <SparkleEffect />
          <motion.div
            className="text-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h1
              className="text-4xl font-extrabold text-primary mb-2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 10 }}
            >
              <AnimatedText>Business Details </AnimatedText>
            </motion.h1>
            {!isSubmitted && !isLoading && (
              <motion.p
                className="text-secondary-foreground text-xl"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <AnimatedText>
                  Step {step + 1} of {questions.length}
                </AnimatedText>
              </motion.p>
            )}
          </motion.div>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }}>
            <Progress value={progress} className="w-full mb-6" />
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 space-y-4"
              >
                <Loader2 className="h-24 w-24 animate-spin text-[#c0bbe5]" />
                <motion.p
                  className="text-xl font-semibold text-primary"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatedText>Launching your dream...</AnimatedText>
                </motion.p>
              </motion.div>
            ) : isSubmitted ? (
              <motion.div
                key="submitted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-6"
              >
                <motion.h2
                  className="text-3xl font-bold text-primary"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <AnimatedText>Business Added Successfully</AnimatedText>
                </motion.h2>
                <motion.p
                  className="text-xl text-secondary-foreground"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <AnimatedText>Your business is ready to boost.</AnimatedText>
                </motion.p>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button onClick={handleReset} className=" text-xl py-6 px-8 bg-[#c0bbe5] hover:bg-[#7E75B8]">
                    <AnimatedText>Add another business!</AnimatedText>
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <FormStep
                key={step}
                question={questions[step].text}
                value={formData[questions[step].key]}
                onChange={(e) => setFormData({ ...formData, [questions[step].key]: e.target.value })}
                onNext={handleNext}
                onSkip={handleSkip}
                isFirst={step === 0}
                canSkip={!questions[step].required && step < questions.length - 1}
                isTextarea={questions[step].isTextarea}
              />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddBusiness

