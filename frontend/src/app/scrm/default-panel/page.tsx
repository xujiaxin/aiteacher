"use client";

import React, { useEffect, useRef, useState } from "react";

export default function MathProblemSolutionPage() {
  // 根据页面标题获取图标
  const getIconByTitle = (title: string) => {
    // 检查是否在GitHub Pages环境（路径包含/aiteacher）
    const isGitHubPages = typeof window !== 'undefined' && window.location.pathname.startsWith('/aiteacher');
    const basePath = isGitHubPages ? '/aiteacher' : '';
    if (title.includes("解题步骤") || title.includes("解题")) {
      return `${basePath}/icon_jietibuzou@2x.png`;
    }
    return `${basePath}/icon_jietibuzou@2x.png`; // 默认图标
  };

  const sectionTitle = "解题步骤";
  const iconPath = getIconByTitle(sectionTitle);

  // 选中的选项状态，默认为 A
  const [selectedOption, setSelectedOption] = useState<string>('A');
  
  // 背景图淡入淡出状态
  const [currentBg, setCurrentBg] = useState<string>('A');
  const [bgOpacity, setBgOpacity] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  // 动态颜色方案状态（从图片提取）
  const [dynamicColorScheme, setDynamicColorScheme] = useState<{
    selected: {
      background: string;
      textColor: string;
    };
    unselected: {
      background: string;
      textColor: string;
    };
  } | null>(null);

  // 根据选中的选项获取背景图片
  const getBackgroundImage = (option: string) => {
    // 检查是否在GitHub Pages环境（路径包含/aiteacher）
    const isGitHubPages = typeof window !== 'undefined' && window.location.pathname.startsWith('/aiteacher');
    const basePath = isGitHubPages ? '/aiteacher' : '';
    switch (option) {
      case 'A':
        return `${basePath}/bg_gzsx@2x.webp`;
      case 'B':
        return `${basePath}/bg_xxyy@2x.png`;
      case 'C':
        return `${basePath}/bg_xxsx@2x.png`;
      case 'D':
        return `${basePath}/bg_czhx@2x.png`;
      default:
        return `${basePath}/bg_gzsx@2x.webp`;
    }
  };

  // 从图片提取颜色的函数
  const extractColorFromImage = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法创建 canvas context'));
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // 获取图片上方10%区域的像素数据
          const top10Percent = Math.floor(img.height * 0.1);
          const imageData = ctx.getImageData(0, 0, img.width, top10Percent);
          const pixels = imageData.data;
          
          // 计算所有像素，找出饱和度最高的颜色
          let highestSaturation = -1;
          let mostSaturatedR = 0, mostSaturatedG = 0, mostSaturatedB = 0;
          
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            // 计算饱和度（使用 RGB 到 HSL 的转换）
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const delta = max - min;
            
            // 饱和度计算：当 max 不为 0 时，饱和度为 delta / max
            // 当 max 为 0 时，饱和度为 0（黑色）
            const saturation = max === 0 ? 0 : delta / max;
            
            // 找出饱和度最高的颜色
            if (saturation > highestSaturation) {
              highestSaturation = saturation;
              mostSaturatedR = r;
              mostSaturatedG = g;
              mostSaturatedB = b;
            }
          }
          
          // 使用饱和度最高的颜色
          const hexColor = `#${mostSaturatedR.toString(16).padStart(2, '0')}${mostSaturatedG.toString(16).padStart(2, '0')}${mostSaturatedB.toString(16).padStart(2, '0')}`;
          resolve(hexColor);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = imageUrl;
    });
  };

  // RGB转HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) {
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      } else if (max === g) {
        h = ((b - r) / d + 2) / 6;
      } else {
        h = ((r - g) / d + 4) / 6;
      }
    }
    return [h * 360, s, l];
  };

  // HSL转RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  };

  // 降低绿色饱和度10%
  const reduceGreenSaturation = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // 判断是否是绿色（G值最高，且G明显大于R和B）
    const isGreen = g > r && g > b && (g - Math.max(r, b)) > 30;
    
    if (isGreen) {
      const [h, s, l] = rgbToHsl(r, g, b);
      // 降低饱和度10%
      const newS = Math.max(0, s - 0.1);
      const [newR, newG, newB] = hslToRgb(h, newS, l);
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    return color;
  };

  // 根据主色生成颜色方案
  const generateColorScheme = (mainColor: string) => {
    // 如果是绿色，降低饱和度10%
    const adjustedColor = reduceGreenSaturation(mainColor);
    
    // 解析主色
    const r = parseInt(adjustedColor.slice(1, 3), 16);
    const g = parseInt(adjustedColor.slice(3, 5), 16);
    const b = parseInt(adjustedColor.slice(5, 7), 16);
    
    // 生成深色版本（用于选中状态）
    const darkR = Math.max(0, Math.floor(r * 0.7));
    const darkG = Math.max(0, Math.floor(g * 0.7));
    const darkB = Math.max(0, Math.floor(b * 0.7));
    const darkColor = `rgb(${darkR}, ${darkG}, ${darkB})`;
    
    // 生成浅色版本（用于未选中背景）
    const lightR = Math.min(255, Math.floor(r * 0.15 + 220));
    const lightG = Math.min(255, Math.floor(g * 0.15 + 220));
    const lightB = Math.min(255, Math.floor(b * 0.15 + 220));
    const lightColor = `rgb(${lightR}, ${lightG}, ${lightB})`;
    
    // 生成渐变中间色
    const midR = Math.min(255, Math.floor(r * 0.85));
    const midG = Math.min(255, Math.floor(g * 0.85));
    const midB = Math.min(255, Math.floor(b * 0.85));
    const midColor = `rgb(${midR}, ${midG}, ${midB})`;
    
    return {
      selected: {
        background: `linear-gradient(111deg, ${adjustedColor} -1%, ${darkColor} 111%)`,
        textColor: "#FFFFFF"
      },
      unselected: {
        background: `linear-gradient(111deg, ${lightColor} -1%, #FFFFFF 111%)`,
        textColor: adjustedColor // 未选中项使用纯色，而不是渐变
      }
    };
  };

  // 当背景图切换时，提取颜色
  useEffect(() => {
    const loadColorFromImage = async () => {
      try {
        const imageUrl = getBackgroundImage(currentBg);
        const mainColor = await extractColorFromImage(imageUrl);
        const scheme = generateColorScheme(mainColor);
        setDynamicColorScheme(scheme);
      } catch (error) {
        console.warn('颜色提取失败，使用默认颜色:', error);
        // 使用默认绿色方案作为后备
        setDynamicColorScheme({
          selected: {
            background: "linear-gradient(111deg, #25C8A0 -1%, #00D785 111%)",
            textColor: "#FFFFFF"
          },
          unselected: {
            background: "linear-gradient(111deg, #DCFFC9 -1%, #FFFFFF 111%)",
            textColor: "#25C8A0"
          }
        });
      }
    };
    
    loadColorFromImage();
  }, [currentBg]);

  // 根据当前背景图获取颜色方案
  const getColorScheme = () => {
    return dynamicColorScheme || {
      selected: {
        background: "linear-gradient(111deg, #25C8A0 -1%, #00D785 111%)",
        textColor: "#FFFFFF"
      },
      unselected: {
        background: "linear-gradient(111deg, #DCFFC9 -1%, #FFFFFF 111%)",
        textColor: "#25C8A0"
      }
    };
  };

  // 获取主色（用于描边和文字）
  const getMainColor = () => {
    if (dynamicColorScheme) {
      // 从selected.background中提取主色
      const bg = dynamicColorScheme.selected.background;
      const match = bg.match(/#[0-9A-Fa-f]{6}/);
      return match ? match[0] : "#25C8A0";
    }
    return "#25C8A0";
  };

  // 获取主色的rgba格式（带20%透明度，用于描边）
  const getMainColorWithOpacity = () => {
    const mainColor = getMainColor();
    let r = parseInt(mainColor.slice(1, 3), 16);
    let g = parseInt(mainColor.slice(3, 5), 16);
    let b = parseInt(mainColor.slice(5, 7), 16);
    // 混合20%纯黑：80%原色 + 20%黑色
    r = Math.round(r * 0.8);
    g = Math.round(g * 0.8);
    b = Math.round(b * 0.8);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  // 处理选项点击，直接切换背景图（无淡入淡出效果）
  const handleOptionClick = (option: string) => {
    if (option === selectedOption || isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedOption(option);
    
    // 直接切换背景图，无淡入淡出
    setCurrentBg(option);
    setBgOpacity(1);
    
    // 短暂延迟后允许再次点击
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  };

  // 渲染选项的辅助函数
  const renderOption = (option: string, label: string) => {
    const scheme = getColorScheme();
    const isSelected = selectedOption === option;
    
    return (
      <div 
        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" 
        style={{ gap: "clamp(8px, 0.9vw, 16px)" }}
        onClick={() => handleOptionClick(option)}
      >
        <div
          className="flex items-center justify-center rounded-[40px] flex-shrink-0"
          style={{
            width: "clamp(36px, 3vw, 58px)",
            height: "clamp(36px, 3vw, 58px)",
            padding: "11px 16px",
            background: isSelected 
              ? scheme.selected.background
              : scheme.unselected.background,
            transition: "background 0.3s ease-in-out"
          }}
        >
          <span
            className="font-bold"
            style={{
              fontSize: "clamp(16px, 1.9vw, 36px)",
              color: isSelected 
                ? scheme.selected.textColor 
                : scheme.unselected.textColor,
              transition: "color 0.3s ease-in-out"
            }}
          >
            {option}
          </span>
        </div>
        <span 
          className="font-bold"
          style={{ 
            fontSize: "clamp(14px, 1.8vw, 24px)",
            color: "#3D3D3D"
          }}
        >
          {label}
        </span>
      </div>
    );
  };

  // SVG 路径动画 refs
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const line1Ref = useRef<SVGLineElement>(null);
  const line2Ref = useRef<SVGLineElement>(null);

  // 解题步骤的文字行
  const solutionLines = [
    "指数函数y=a<sup>x</sup>的图象特征:",
    "当a>1时,函数递增",
    "当0<a<1时,函数递减",
    "第二步:根据图象分析a和b的大小关系",
    "从图象可以看出,两个函数都递增,所以a>1,b>1",
    "比较函数增长速度:当x>0时,y=b<sup>x</sup>的图象在y=a<sup>x</sup>上方",
    "所以b>a,即b>a>1"
  ];

  // 文字逐行显示状态 - 初始隐藏，等待SVG动画完成
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  // SVG 容器显示状态 - 初始隐藏，等待动画
  const [showSvg, setShowSvg] = useState(false);
  // SVG 箭头显示状态 - 初始隐藏，等待坐标轴绘制完成
  const [showArrows, setShowArrows] = useState(false);
  // SVG 坐标轴标签显示状态（X、Y、0）- 初始隐藏，等待箭头显示
  const [showAxisLabels, setShowAxisLabels] = useState(false);
  // SVG 函数标签显示状态（y=b^x、y=a^x）- 初始隐藏，等待曲线绘制完成
  const [showFunctionLabels, setShowFunctionLabels] = useState(false);

  useEffect(() => {
    // 确保在客户端执行
    if (typeof window === 'undefined') return;
    
    // 初始化 SVG 元素为隐藏状态（立即执行，不等待动画）
    const initSvgElements = () => {
      // 初始化线条为隐藏
      const initLine = (element: SVGLineElement | null) => {
        if (!element) return;
        try {
          const x1 = parseFloat(element.getAttribute("x1") || "0");
          const y1 = parseFloat(element.getAttribute("y1") || "0");
          const x2 = parseFloat(element.getAttribute("x2") || "0");
          const y2 = parseFloat(element.getAttribute("y2") || "0");
          const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          if (length > 0) {
            element.style.strokeDasharray = `${length}`;
            element.style.strokeDashoffset = `${length}`;
            element.style.transition = "none"; // 初始化时不使用过渡
          }
        } catch (error) {
          console.warn('Line init error:', error);
        }
      };

      // 初始化路径为隐藏
      const initPath = (element: SVGPathElement | null) => {
        if (!element) return;
        try {
          const length = element.getTotalLength();
          if (length > 0) {
            element.style.strokeDasharray = `${length}`;
            element.style.strokeDashoffset = `${length}`;
            element.style.transition = "none"; // 初始化时不使用过渡
          }
        } catch (error) {
          console.warn('Path init error:', error);
        }
      };

      // 立即初始化所有 SVG 元素为隐藏状态
      initLine(line1Ref.current);
      initLine(line2Ref.current);
      initPath(path1Ref.current);
      initPath(path2Ref.current);
    };

    // 为路径添加动画
    const animatePath = (element: SVGPathElement | null, delay: number = 0) => {
      if (!element) {
        console.warn('Path element not found');
        return;
      }
      
      try {
        const length = element.getTotalLength();
        if (length === 0) {
          console.warn('Path length is 0');
          return;
        }
        
        // 确保已经初始化
        element.style.strokeDasharray = `${length}`;
        element.style.strokeDashoffset = `${length}`;
        element.style.transition = "stroke-dashoffset 2s ease-in-out";
        
        setTimeout(() => {
          if (element) {
            element.style.strokeDashoffset = "0";
          }
        }, delay);
      } catch (error) {
        console.warn('Path animation error:', error);
      }
    };

    // 为直线添加动画
    const animateLine = (element: SVGLineElement | null, delay: number = 0) => {
      if (!element) {
        console.warn('Line element not found');
        return;
      }
      
      try {
        const x1 = parseFloat(element.getAttribute("x1") || "0");
        const y1 = parseFloat(element.getAttribute("y1") || "0");
        const x2 = parseFloat(element.getAttribute("x2") || "0");
        const y2 = parseFloat(element.getAttribute("y2") || "0");
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        if (length === 0) {
          console.warn('Line length is 0');
          return;
        }
        
        // 确保已经初始化
        element.style.strokeDasharray = `${length}`;
        element.style.strokeDashoffset = `${length}`;
        element.style.transition = "stroke-dashoffset 1.5s ease-in-out";
        
        setTimeout(() => {
          if (element) {
            element.style.strokeDashoffset = "0";
          }
        }, delay);
      } catch (error) {
        console.warn('Line animation error:', error);
      }
    };

    // 立即初始化 SVG 元素为隐藏状态
    // 使用 setTimeout 确保 DOM 已渲染
    setTimeout(() => {
      initSvgElements();
    }, 0);

    // 左侧文字先出现
    const textAnimationStartDelay = 300; // 页面加载后 300ms 开始文字动画
    const textAnimationDuration = solutionLines.length * 300; // 所有文字行的动画时长
    
    // 文字逐行显示动画 - 先开始
    for (let i = 0; i < solutionLines.length; i++) {
      setTimeout(() => {
        setVisibleLines(prev => {
          // 确保按顺序添加，避免重复
          if (!prev.includes(i)) {
            return [...prev, i];
          }
          return prev;
        });
      }, textAnimationStartDelay + i * 300);
    }

    // 文字动画完成后，显示 SVG 图形
    const svgContainerDelay = textAnimationStartDelay + textAnimationDuration + 500; // 文字动画结束后 500ms 开始淡入
    
    // 在容器显示前，确保 SVG 线条是隐藏的
    setTimeout(() => {
      // 重新初始化 SVG 元素为隐藏状态（确保刷新后线条消失）
      initSvgElements();
      // 然后显示容器
      setShowSvg(true);
    }, svgContainerDelay);

    // SVG 动画在容器显示后开始
    const svgStartDelay = svgContainerDelay + 300; // 容器淡入后再等待 300ms
    
    // 等待 SVG 元素渲染后再开始动画
    let retryCount = 0;
    const maxRetries = 20; // 最多重试20次
    
    const initSvgAnimations = () => {
      // 检查所有refs是否都已准备好
      const allRefsReady = line1Ref.current && line2Ref.current && path1Ref.current && path2Ref.current;
      
      if (allRefsReady) {
        // 确保线条仍然是隐藏状态
        initSvgElements();
        
        // 使用 requestAnimationFrame 确保 DOM 已完全渲染
        requestAnimationFrame(() => {
          // 短暂延迟后开始动画
          setTimeout(() => {
            // 1. X和Y坐标轴同时出现
            animateLine(line1Ref.current, 0); // X轴
            animateLine(line2Ref.current, 0); // Y轴，同时出现
            
            // 2. 坐标轴动画完成后（1.5s），显示箭头
            const arrowDelay = 1500 + 300; // 坐标轴动画时长1.5s + 300ms延迟
            setTimeout(() => {
              setShowArrows(true);
            }, arrowDelay);
            
            // 3. 箭头显示后，显示X、Y、0标签
            const axisLabelsDelay = arrowDelay + 300;
            setTimeout(() => {
              setShowAxisLabels(true);
            }, axisLabelsDelay);
            
            // 4. 标签显示后，显示两条曲线
            const curvesDelay = axisLabelsDelay + 300;
            animatePath(path1Ref.current, curvesDelay); // y=b^x 曲线
            animatePath(path2Ref.current, curvesDelay); // y=a^x 曲线，同时出现
            
            // 5. 曲线动画完成后（2s），显示函数标签
            const functionLabelsDelay = curvesDelay + 2000 + 300; // 曲线动画时长2s + 300ms延迟
            setTimeout(() => {
              setShowFunctionLabels(true);
            }, functionLabelsDelay);
          }, 50);
        });
      } else {
        // 如果元素还没准备好，等待一段时间后重试
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(initSvgAnimations, 200); // 增加重试间隔到200ms
        } else {
          console.warn('SVG elements not ready after max retries');
        }
      }
    };
    
    // 在 SVG 容器显示后开始检查并初始化动画
    setTimeout(() => {
      initSvgAnimations();
    }, svgStartDelay);
  }, []); // 空依赖数组，确保只执行一次

  return (
    <div 
      className="min-h-screen w-full fixed inset-0"
      style={{
        position: 'relative',
      }}
    >
      {/* 背景图层 - 当前背景 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${getBackgroundImage(currentBg)}')`,
          zIndex: 0,
        }}
      />
      {/* 主内容区域 */}
      <div 
        className="relative mx-auto"
        style={{
          width: "100%",
          height: "100vh",
          paddingLeft: "clamp(16px, 2.08vw, 40px)",
          paddingRight: "clamp(16px, 2.08vw, 40px)",
          paddingTop: "clamp(16px, 2.08vw, 40px)",
          paddingBottom: "clamp(16px, 2.08vw, 40px)",
          boxSizing: "border-box",
          zIndex: 1
        }}
      >
        {/* 主卡片 */}
        <div
          className="relative rounded-[40px] mx-auto"
          style={{ 
            width: "100%",
            height: "100%",
            maxWidth: "1840px",
            borderRadius: "40px",
            background: "#FFFFFF",
            boxShadow: `0 0 0 clamp(7px, 0.73vw, 14px) ${getMainColorWithOpacity()}`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            transition: "box-shadow 0.3s ease-in-out"
          }}
        >
          <div
            className="relative rounded-[40px] w-full h-full flex flex-col"
            style={{ 
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.85) 3%, rgba(255, 255, 255, 0.95) 8%, #FFFFFF 20%, #FFFFFF 100%)",
              boxShadow: "none",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              overflow: "hidden"
            }}
          >
            {/* 背景装饰图片层 - 在最前面 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 10,
                overflow: "visible"
              }}
            >
              <img
                src={`${typeof window !== 'undefined' && window.location.pathname.startsWith('/aiteacher') ? '/aiteacher' : ''}/bg_toppoint@2x.png`}
                alt=""
                className="pointer-events-none"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "clamp(200px, 20vw, 400px)",
                  height: "auto",
                  objectFit: "contain"
                }}
              />
            </div>
          {/* 上半部分：题目区域 */}
          <div 
            className="relative rounded-[40px] flex-shrink-0"
            style={{ 
              paddingLeft: "clamp(16px, 5.4vw, 104px)",
              paddingRight: "clamp(16px, 5.4vw, 104px)",
              paddingTop: "clamp(16px, 4.6vw, 88px)",
              paddingBottom: "clamp(16px, 1.1vw, 21px)",
              boxSizing: "content-box",
              boxShadow: "none",
              zIndex: 2
            }}
          >
            {/* 题目文本 */}
            <div className="mb-6 relative" style={{ zIndex: 2 }}>
              <h2 
                className="font-semibold text-[#3D3D3D] mb-4 leading-relaxed"
                style={{ fontSize: "clamp(18px, 2.5vw, 32px)" }}
              >
                已知函数y=α<sup>x</sup>, y=b<sup>x</sup>(a,b&gt;0且a≠1,b≠1)的图象如图所示, 则下列结论正确的是( )
              </h2>
              {/* 选项列表 */}
              <div 
                className="flex flex-wrap items-center"
                style={{ gap: "clamp(32px, 3vw, 48px) clamp(24px, 2.5vw, 48px)" }}
              >
                {renderOption('A', '高中数学')}
                {renderOption('B', '小学英语')}
                {renderOption('C', '小学数学')}
                {renderOption('D', '初中化学')}
              </div>
            </div>

            {/* 难度等级和作答正确率 */}
            <div 
              className="flex items-center flex-wrap relative"
              style={{ gap: "40px", zIndex: 1 }}
            >
              <div className="flex items-center gap-2">
                <span 
                  className="text-[#ADB2BB]"
                  style={{ fontSize: "14px" }}
                >
                  难度等级:
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    // 前4颗星星使用相同的路径（黄色填充）
                    const isLastStar = star === 5;
                    // 所有星星使用相同的路径
                    const starPath = "M1.9703 7.25055C0.0818217 7.48942 -0.675243 9.81943 0.712164 11.1227L4.56734 14.7441C4.79183 14.955 4.89289 15.266 4.83523 15.5686L3.84493 20.7644C3.48854 22.6342 5.47056 24.0742 7.13878 23.1575L11.7742 20.6101C12.0442 20.4617 12.3712 20.4617 12.6412 20.6101L17.2766 23.1575C18.9448 24.0742 20.9269 22.6342 20.5705 20.7644L19.5802 15.5686C19.5225 15.266 19.6236 14.955 19.8481 14.7441L23.7032 11.1227C25.0906 9.81943 24.3336 7.48942 22.4451 7.25055L17.1976 6.58679C16.892 6.54814 16.6274 6.35591 16.4962 6.07724L14.2434 1.29168C13.4327 -0.430559 10.9827 -0.430559 10.172 1.29168L7.91915 6.07724C7.78796 6.35591 7.52338 6.54814 7.21781 6.58679L1.9703 7.25055Z";
                    // 第5颗星星的边框路径
                    const strokePath = "M0.712164 11.1227C-0.675243 9.81943 0.0818214 7.48942 1.9703 7.25055L7.21781 6.58679C7.52338 6.54814 7.78796 6.35591 7.91915 6.07724L10.172 1.29168C10.9827 -0.430559 13.4327 -0.430559 14.2434 1.29168L16.4962 6.07724C16.6274 6.35591 16.892 6.54814 17.1976 6.58679L22.4451 7.25055C24.3336 7.48942 25.0906 9.81943 23.7032 11.1227L19.8481 14.7441C19.6236 14.955 19.5225 15.266 19.5802 15.5686L20.5705 20.7644C20.9269 22.6342 18.9448 24.0742 17.2766 23.1575L12.6412 20.6101C12.3712 20.4617 12.0442 20.4617 11.7742 20.6101L7.13878 23.1575C5.47056 24.0742 3.48854 22.6342 3.84493 20.7644L4.83523 15.5686C4.89289 15.266 4.79183 14.955 4.56734 14.7441L0.712164 11.1227ZM1.06383 9.09649Q1.30893 8.34217 2.09579 8.24264L7.3433 7.57889Q8.37918 7.44786 8.82391 6.50316L11.0767 1.7176Q11.4146 1 12.2077 1Q13.0008 1 13.3386 1.7176L15.5915 6.50316Q16.0362 7.44786 17.0721 7.57889L22.3196 8.24265Q23.1065 8.34217 23.3516 9.09649Q23.5967 9.85081 23.0186 10.3938L19.1634 14.0152Q18.4024 14.7301 18.5979 15.7558L19.5882 20.9516Q19.7366 21.7307 19.095 22.1969Q18.4533 22.6631 17.7582 22.2811L13.1228 19.7337Q12.2077 19.2308 11.2926 19.7337L6.65717 22.2811Q5.96207 22.6631 5.32041 22.1969Q4.67875 21.7307 4.82724 20.9516L5.81754 15.7558Q6.01303 14.7301 5.252 14.0152L1.39683 10.3938Q0.818739 9.85081 1.06383 9.09649Z";
                    const viewBox = "0 0 25 24";
                    
                    return (
                      <svg
                        key={star}
                        width="20px"
                        height="20px"
                        viewBox={viewBox}
                        fill="none"
                        style={{ width: "20px", height: "20px" }}
                      >
                        {isLastStar ? (
                          <>
                            {/* 第5颗星星：灰色填充 */}
                            <path
                              d={starPath}
                              fill="#ADB2BB"
                            />
                            {/* 第5颗星星：灰色描边 */}
                            <path
                              d={strokePath}
                              fill="#A3A8B2"
                            />
                          </>
                        ) : (
                          /* 前4颗星星：黄色填充 */
                          <path
                            d={starPath}
                            fill="#FF9D09"
                          />
                        )}
                      </svg>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span 
                  className="text-[#ADB2BB]"
                  style={{ fontSize: "14px" }}
                >
                  作答正确率:
                </span>
                <div className="flex items-center gap-1">
                  <span 
                    className="font-semibold text-[#3D3D3D]"
                    style={{ fontSize: "16px" }}
                  >
                    全国
                  </span>
                  <span 
                    className="font-bold text-[#F94235]"
                    style={{ fontSize: "16px", lineHeight: "1" }}
                  >
                    35.8%
                  </span>
                  <svg
                    width="18px"
                    height="18px"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ 
                      width: "18px", 
                      height: "18px",
                      display: "inline-block",
                      verticalAlign: "middle",
                      flexShrink: 0
                    }}
                  >
                    <g transform="translate(4, 4)">
                      <path
                        d="M9.5 8L13.5858 8C14.4767 8 14.9229 9.07714 14.2929 9.70711L8.70711 15.2929C8.31658 15.6834 7.68342 15.6834 7.29289 15.2929L1.70711 9.70711C1.07714 9.07714 1.52331 8 2.41421 8L6.5 8L6.5 1C6.5 0.447715 6.94772 0 7.5 0L8.5 0C9.05229 0 9.5 0.447715 9.5 1L9.5 8Z"
                        fill="#F94235"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 下半部分：解题区域（左右并排） */}
          <div 
            className="relative rounded-b-[40px] flex-1 w-full"
            style={{ 
              background: "#F6F9F8",
              backdropFilter: "blur(10px)",
              boxShadow: "none",
              paddingLeft: "clamp(16px, 5.4vw, 104px)",
              paddingRight: "clamp(16px, 5.4vw, 104px)",
              paddingTop: "clamp(16px, 1.1vw, 21px)",
              paddingBottom: "clamp(16px, 1.1vw, 21px)"
            }}
          >
            <div 
              className="flex flex-col lg:flex-row items-start gap-6 lg:gap-[240px] h-full"
              style={{
                gap: "clamp(24px, 12.5vw, 240px)"
              }}
            >
              {/* 左侧：解题步骤区域 */}
              <div 
                className="flex-1 w-full lg:w-auto"
                style={{
                  maxWidth: "clamp(300px, 42vw, 805px)"
                }}
              >
                <div 
                  className="flex items-start"
                  style={{ gap: "clamp(16px, 1.5vw, 24px)" }}
                >
                  <div className="flex-1">
                    <div 
                      className="flex items-center overflow-hidden"
                      style={{
                        width: "fit-content",
                        height: "fit-content",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        gap: "clamp(16px, 1.5vw, 24px)"
                      }}
                    >
                      <img 
                        src={iconPath}
                        alt={sectionTitle}
                        style={{
                          width: "44px",
                          height: "44px",
                          objectFit: "contain"
                        }}
                      />
                      <h3 
                        className="font-bold mb-4 bg-gradient-to-r from-[#F79D02] to-[#018B86] bg-clip-text text-transparent"
                        style={{ fontSize: "clamp(20px, 2.5vw, 32px)", margin: 0 }}
                      >
                        {sectionTitle}
                      </h3>
                    </div>
                    <div 
                      className="space-y-3 text-[#3D4141]"
                      style={{ fontSize: "clamp(14px, 1.8vw, 20px)" }}
                    >
                      <div className="relative inline-block">
                        <div 
                          className="bg-[#FFF1B9] absolute"
                          style={{ 
                            height: "0.6em",
                            width: "100%",
                            bottom: "0",
                            left: "0"
                          }}
                        />
                        <span 
                          className="font-semibold relative z-10 inline-block"
                          style={{ 
                            fontSize: "clamp(16px, 2vw, 24px)",
                            color: getMainColor()
                          }}
                        >
                          第一步，分析指数函数图形特征
                        </span>
                      </div>
                      <div className="leading-relaxed">
                        {solutionLines.map((line, index) => {
                          const isVisible = visibleLines.includes(index);
                          return (
                            <div
                              key={index}
                              style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                                transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                                marginBottom: index < solutionLines.length - 1 ? '0.5rem' : '0',
                                pointerEvents: isVisible ? 'auto' : 'none'
                              }}
                              dangerouslySetInnerHTML={{ __html: line }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：图形区域 */}
              <div 
                className="flex-shrink-0 w-full lg:w-auto"
                style={{
                  width: "clamp(300px, 35vw, 667px)",
                  height: "clamp(300px, 35vw, 667px)",
                  maxWidth: "667px",
                  maxHeight: "667px"
                }}
              >
                <div 
                  className="relative w-full h-full rounded-lg"
                  style={{
                    opacity: showSvg ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out"
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 667 667"
                    preserveAspectRatio="xMidYMid meet"
                    className="absolute inset-0"
                  >
                    {/* 箭头标记定义 */}
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3, 0 6"
                          fill="#3D3D3D"
                        />
                      </marker>
                    </defs>
                    
                    {/* 坐标轴 */}
                    <line
                      ref={line1Ref}
                      x1="39"
                      y1="478.5"
                      x2="629"
                      y2="478.5"
                      stroke="#3D3D3D"
                      strokeWidth="2"
                      markerEnd={showArrows ? "url(#arrowhead)" : undefined}
                    />
                    <line
                      ref={line2Ref}
                      x1="39"
                      y1="478.5"
                      x2="39"
                      y2="79"
                      stroke="#3D3D3D"
                      strokeWidth="2"
                      markerEnd={showArrows ? "url(#arrowhead)" : undefined}
                    />

                    {/* Y轴标签 - 更靠近Y轴 */}
                    <text
                      x="50"
                      y="30"
                      fontSize="clamp(18px, 2vw, 24px)"
                      fill="#3D3D3D"
                      textAnchor="middle"
                      fontWeight="bold"
                      opacity={showAxisLabels ? 1 : 0}
                      style={{
                        transition: "opacity 0.5s ease-in-out"
                      }}
                    >
                      Y
                    </text>

                    {/* X轴标签 */}
                    <text
                      x="590"
                      y="520"
                      fontSize="clamp(18px, 2vw, 24px)"
                      fill="#3D3D3D"
                      textAnchor="middle"
                      fontWeight="bold"
                      opacity={showAxisLabels ? 1 : 0}
                      style={{
                        transition: "opacity 0.5s ease-in-out"
                      }}
                    >
                      X
                    </text>

                    {/* 原点 - 在坐标轴起点位置 */}
                    <text
                      x="39"
                      y="478.5"
                      fontSize="clamp(18px, 2vw, 24px)"
                      fill="#3D3D3D"
                      textAnchor="middle"
                      fontWeight="bold"
                      opacity={showAxisLabels ? 1 : 0}
                      style={{
                        transition: "opacity 0.5s ease-in-out",
                        transform: "translate(-10px, 15px)"
                      }}
                    >
                      0
                    </text>

                    {/* 函数曲线 y=b^x */}
                    <path
                      ref={path1Ref}
                      d="M 42 400 Q 150 350, 250 300 T 450 200 T 550 150"
                      fill="none"
                      stroke="#3D3D3D"
                      strokeWidth="2"
                    />

                    {/* 函数曲线 y=a^x */}
                    <path
                      ref={path2Ref}
                      d="M 43 420 Q 180 380, 300 340 T 480 280 T 580 250"
                      fill="none"
                      stroke="#3D3D3D"
                      strokeWidth="2"
                    />

                    {/* 函数标签 y=b^x */}
                    <text
                      x="350"
                      y="90"
                      fontSize="clamp(18px, 2vw, 24px)"
                      fill="#3D3D3D"
                      fontWeight="bold"
                      opacity={showFunctionLabels ? 1 : 0}
                      style={{
                        transition: "opacity 0.5s ease-in-out"
                      }}
                    >
                      y=b<sup>x</sup>
                    </text>

                    {/* 函数标签 y=a^x */}
                    <text
                      x="534"
                      y="120"
                      fontSize="clamp(18px, 2vw, 24px)"
                      fill="#3D3D3D"
                      fontWeight="bold"
                      opacity={showFunctionLabels ? 1 : 0}
                      style={{
                        transition: "opacity 0.5s ease-in-out"
                      }}
                    >
                      y=a<sup>x</sup>
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

