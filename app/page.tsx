"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Palette, Share2, Facebook, Twitter, MessageCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MooncakeConfig {
  shape: "round" | "square" | "flower" | "heart"
  filling: "lotus" | "red-bean" | "durian" | "custard" | "chocolate" | "green-tea"
  stamp: string
  background: "moon" | "earth" | "tea-set" | "family-table" | "none"
}

const fillingColors = {
  lotus: "#F4E4BC",
  "red-bean": "#8B0000",
  durian: "#FFFF99",
  custard: "#FFD700",
  chocolate: "#8B4513",
  "green-tea": "#90EE90",
}

const shapeImages = {
  round: "/traditional-round-shape.png",
  square: "/modern-square-shape.png",
  heart: "/heart-shape.png",
  flower: "/flower-shape.png",
}

export default function MooncakeCustomizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [config, setConfig] = useState<MooncakeConfig>({
    shape: "round",
    filling: "lotus",
    stamp: "福",
    background: "moon",
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const drawShapeImage = async (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    return new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.save()

        // Calculate scale to fit the desired size
        const scale = (size * 2.2) / Math.max(img.width, img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale

        // Position the shape centered
        const drawX = x - scaledWidth / 2
        const drawY = y - scaledHeight / 2

        // Draw the shape image directly
        ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight)

        ctx.restore()
        resolve()
      }

      img.src = shapeImages[config.shape]
    })
  }

  const drawMooncake = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsGenerating(true)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    drawBackground(ctx, canvas.width, canvas.height)

    // Draw mooncake
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const size = 120

    // Draw shape using PNG
    await drawShapeImage(ctx, centerX, centerY, size)

    // Draw filling and stamp
    drawFilling(ctx, centerX, centerY, size * 0.6)
    drawStamp(ctx, centerX, centerY)

    setIsGenerating(false)
  }

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    switch (config.background) {
      case "moon":
        // Night sky with moon
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, "#1a1a2e")
        gradient.addColorStop(1, "#16213e")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Stars
        ctx.fillStyle = "#ffffff"
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width
          const y = Math.random() * height * 0.6
          ctx.beginPath()
          ctx.arc(x, y, 1, 0, Math.PI * 2)
          ctx.fill()
        }

        // Moon
        ctx.fillStyle = "#f5f5dc"
        ctx.beginPath()
        ctx.arc(width * 0.8, height * 0.2, 30, 0, Math.PI * 2)
        ctx.fill()
        break

      case "earth":
        // Space view
        ctx.fillStyle = "#000011"
        ctx.fillRect(0, 0, width, height)

        // Earth in background
        const earthGradient = ctx.createRadialGradient(width * 0.2, width * 0.3, 0, width * 0.2, height * 0.3, 60)
        earthGradient.addColorStop(0, "#4169E1")
        earthGradient.addColorStop(0.7, "#228B22")
        earthGradient.addColorStop(1, "#1E90FF")
        ctx.fillStyle = earthGradient
        ctx.beginPath()
        ctx.arc(width * 0.2, height * 0.3, 60, 0, Math.PI * 2)
        ctx.fill()
        break

      case "tea-set":
        // Warm tea background
        ctx.fillStyle = "#8B4513"
        ctx.fillRect(0, 0, width, height)

        // Table texture
        ctx.fillStyle = "#A0522D"
        for (let i = 0; i < width; i += 20) {
          ctx.fillRect(i, height - 50, 10, 50)
        }
        break

      case "family-table":
        // Warm family setting
        ctx.fillStyle = "#DEB887"
        ctx.fillRect(0, 0, width, height)

        // Table pattern
        ctx.fillStyle = "#CD853F"
        ctx.fillRect(0, height - 60, width, 60)
        break

      default:
        ctx.fillStyle = "#f5f5f5"
        ctx.fillRect(0, 0, width, height)
    }
  }

  const drawFilling = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Adjust filling size and position based on mooncake shape
    let fillingSize = size
    const fillingX = x
    let fillingY = y

    if (config.shape === "heart") {
      fillingSize = size * 0.4
      fillingY = y + size * 0.1
    } else if (config.shape === "flower") {
      fillingSize = size * 0.3
    } else if (config.shape === "square") {
      fillingSize = size * 0.6
    }

    ctx.fillStyle = fillingColors[config.filling]

    // Draw different filling shapes based on mooncake shape
    switch (config.shape) {
      case "round":
      case "flower":
      case "heart": // Changed heart to use circle filling
        // Circle filling for round, flower, and heart shapes
        ctx.beginPath()
        ctx.arc(fillingX, fillingY, fillingSize, 0, Math.PI * 2)
        ctx.fill()
        break

      case "square":
        // Square filling for square shape
        const squareSize = fillingSize * 1.4
        ctx.fillRect(fillingX - squareSize / 2, fillingY - squareSize / 2, squareSize, squareSize)
        break
    }

    // Add filling texture
    ctx.fillStyle = `${fillingColors[config.filling]}88`
    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * fillingSize * 0.8
      const offsetY = (Math.random() - 0.5) * fillingSize * 0.8
      ctx.beginPath()
      ctx.arc(fillingX + offsetX, fillingY + offsetY, fillingSize * 0.15, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const drawStamp = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#8B0000"
    ctx.font = "bold 24px serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(config.stamp, x, y)
  }

  const exportImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "my-mooncake.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  const shareToSocial = (platform: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageUrl = canvas.toDataURL()
    const text = "Check out my custom mooncake design! 🥮✨"

    switch (platform) {
      case "facebook":
        // For Facebook, we'll open a share dialog
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`,
          "_blank",
        )
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
          "_blank",
        )
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + window.location.href)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
        break
    }
  }

  useEffect(() => {
    drawMooncake()
  }, [config])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview Area */}
          <Card className="lg:sticky lg:top-4 bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Your Mooncake
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex justify-center relative">
                <div
                  className={`transition-all duration-300 ${isGenerating ? "scale-95 opacity-70" : "scale-100 opacity-100"}`}
                >
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="border-2 border-purple-200 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
                  />
                </div>
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={exportImage}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50 transform hover:scale-105 transition-all duration-200 bg-transparent"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuItem
                      onClick={() => shareToSocial("facebook")}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => shareToSocial("twitter")}
                      className="cursor-pointer hover:bg-sky-50"
                    >
                      <Twitter className="h-4 w-4 mr-2 text-sky-500" />
                      Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => shareToSocial("whatsapp")}
                      className="cursor-pointer hover:bg-green-50"
                    >
                      <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareToSocial("copy")} className="cursor-pointer hover:bg-gray-50">
                      <Share2 className="h-4 w-4 mr-2 text-gray-600" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Customization Controls */}
          <div className="space-y-6">
            <Tabs defaultValue="shape" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-purple-100 to-blue-100 p-1 rounded-lg">
                <TabsTrigger
                  value="shape"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200"
                >
                  Shape
                </TabsTrigger>
                <TabsTrigger
                  value="filling"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200"
                >
                  Filling
                </TabsTrigger>
                <TabsTrigger
                  value="stamp"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200"
                >
                  Stamp
                </TabsTrigger>
                <TabsTrigger
                  value="scene"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200"
                >
                  Scene
                </TabsTrigger>
              </TabsList>

              <TabsContent value="shape" className="space-y-4">
                <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle>Choose Your Shape</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <RadioGroup
                      value={config.shape}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, shape: value as any }))}
                      className="grid grid-cols-1 gap-4"
                    >
                      {[
                        {
                          value: "round",
                          label: "Traditional Round",
                          desc: "Classic circular mooncake with decorative edges",
                        },
                        {
                          value: "square",
                          label: "Modern Square",
                          desc: "Contemporary square design with rounded corners",
                        },
                        { value: "flower", label: "Flower Shape", desc: "Beautiful flower petals with center design" },
                        {
                          value: "heart",
                          label: "Heart Shape",
                          desc: "Romantic heart design perfect for special occasions",
                        },
                      ].map((shape) => (
                        <div
                          key={shape.value}
                          className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md transform hover:scale-[1.02] ${
                            config.shape === shape.value
                              ? "border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-md"
                              : "border-purple-200 hover:border-purple-300 hover:bg-purple-25"
                          }`}
                          onClick={() => setConfig((prev) => ({ ...prev, shape: shape.value as any }))}
                        >
                          <RadioGroupItem value={shape.value} id={shape.value} className="border-purple-400" />
                          <div className="flex-1">
                            <Label
                              htmlFor={shape.value}
                              className="text-base font-medium cursor-pointer text-purple-800"
                            >
                              {shape.label}
                            </Label>
                            <p className="text-sm text-purple-600">{shape.desc}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="filling" className="space-y-4">
                <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle>Select Your Filling</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <RadioGroup
                      value={config.filling}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, filling: value as any }))}
                      className="grid grid-cols-2 gap-3"
                    >
                      {Object.entries(fillingColors).map(([key, color]) => (
                        <div
                          key={key}
                          className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md transform hover:scale-105 ${
                            config.filling === key
                              ? "border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-md"
                              : "border-purple-200 hover:border-purple-300"
                          }`}
                          onClick={() => setConfig((prev) => ({ ...prev, filling: key as any }))}
                        >
                          <RadioGroupItem value={key} id={key} className="border-purple-400" />
                          <div className="flex items-center space-x-2 flex-1">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                            ></div>
                            <Label htmlFor={key} className="cursor-pointer font-medium text-purple-800 capitalize">
                              {key.replace("-", " ")}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stamp" className="space-y-4">
                <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle>Custom Stamp</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <Label htmlFor="stamp-input" className="text-base font-medium mb-2 block text-purple-800">
                        Enter your initials or emoji
                      </Label>
                      <Input
                        id="stamp-input"
                        value={config.stamp}
                        onChange={(e) => setConfig((prev) => ({ ...prev, stamp: e.target.value.slice(0, 3) }))}
                        placeholder="福 or ABC or 🌙"
                        className="text-center text-lg border-purple-300 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                        maxLength={3}
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium mb-2 block text-purple-800">Quick Options</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {["福", "寿", "喜", "🌙", "⭐", "❤️", "🎉", "🏮"].map((symbol) => (
                          <Button
                            key={symbol}
                            variant="outline"
                            size="sm"
                            onClick={() => setConfig((prev) => ({ ...prev, stamp: symbol }))}
                            className="text-lg border-purple-300 hover:bg-purple-50 hover:border-purple-400 transform hover:scale-110 transition-all duration-200"
                          >
                            {symbol}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scene" className="space-y-4">
                <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle>Background Scene</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <RadioGroup
                      value={config.background}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, background: value as any }))}
                      className="grid grid-cols-1 gap-3"
                    >
                      {[
                        { value: "moon", label: "Moonlit Night" },
                        { value: "earth", label: "Earth View from Space" },
                        { value: "tea-set", label: "Traditional Tea Set" },
                        { value: "family-table", label: "Family Dinner Table" },
                        { value: "none", label: "Simple Background" },
                      ].map((bg) => (
                        <div
                          key={bg.value}
                          className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md transform hover:scale-[1.02] ${
                            config.background === bg.value
                              ? "border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-md"
                              : "border-purple-200 hover:border-purple-300"
                          }`}
                          onClick={() => setConfig((prev) => ({ ...prev, background: bg.value as any }))}
                        >
                          <RadioGroupItem value={bg.value} id={bg.value} className="border-purple-400" />
                          <Label htmlFor={bg.value} className="cursor-pointer font-medium text-purple-800">
                            {bg.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
