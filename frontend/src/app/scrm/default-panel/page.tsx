"use client";

import React, { useEffect, useRef, useState } from "react";

export default function MathProblemSolutionPage() {
  // 根据页面标题获取图标
  const getIconByTitle = (title: string) => {
    if (title.includes("解题步骤") || title.includes("解题")) {
      return "/icon_jietibuzou@2x.png";
    }
    return "/icon_jietibuzou@2x.png"; // 默认图标
  };

  const sectionTitle = "解题步骤";
  const iconPath = getIconByTitle(sectionTitle);

  // SVG 路径动画 refs
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const line1Ref = useRef<SVGLineElement>(null);
  const line2Ref = useRef<SVGLineElement>(null);

  // 文字逐行显示状态
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  // SVG 容器显示状态
  const [showSvg, setShowSvg] = useState(false);
  
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

  useEffect(() => {
    // 为路径添加动画
    const animatePath = (element: SVGPathElement | null, delay: number = 0) => {
      if (!element) return;
      
      const length = element.getTotalLength();
      element.style.strokeDasharray = `${length}`;
      element.style.strokeDashoffset = `${length}`;
      element.style.transition = "stroke-dashoffset 2s ease-in-out";
      
      setTimeout(() => {
        element.style.strokeDashoffset = "0";
      }, delay);
    };

    // 为直线添加动画（计算直线长度）
    const animateLine = (element: SVGLineElement | null, delay: number = 0) => {
      if (!element) return;
      
      const x1 = parseFloat(element.getAttribute("x1") || "0");
      const y1 = parseFloat(element.getAttribute("y1") || "0");
      const x2 = parseFloat(element.getAttribute("x2") || "0");
      const y2 = parseFloat(element.getAttribute("y2") || "0");
      
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      element.style.strokeDasharray = `${length}`;
      element.style.strokeDashoffset = `${length}`;
      element.style.transition = "stroke-dashoffset 1.5s ease-in-out";
      
      setTimeout(() => {
        element.style.strokeDashoffset = "0";
      }, delay);
    };

    // 文字逐行显示动画（先开始）
    const lines = [
      "指数函数y=a<sup>x</sup>的图象特征:",
      "当a>1时,函数递增",
      "当0<a<1时,函数递减",
      "第二步:根据图象分析a和b的大小关系",
      "从图象可以看出,两个函数都递增,所以a>1,b>1",
      "比较函数增长速度:当x>0时,y=b<sup>x</sup>的图象在y=a<sup>x</sup>上方",
      "所以b>a,即b>a>1"
    ];
    
    // 文字动画：每行间隔 300ms，从 0 开始
    lines.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, index]);
      }, index * 300);
    });

    // SVG 容器在文字动画完成后淡入显示
    // 文字动画大约在 7 * 300 + 500 = 2600ms 后完成
    const svgContainerDelay = 2600;
    
    setTimeout(() => {
      setShowSvg(true);
    }, svgContainerDelay);

    // SVG 动画从左到右依次呈现（在容器显示之后）
    const svgStartDelay = svgContainerDelay + 300; // 容器淡入后再开始路径动画
    
    // X轴（从左到右）
    animateLine(line1Ref.current, svgStartDelay);
    
    // Y轴（从下到上，在X轴之后）
    animateLine(line2Ref.current, svgStartDelay + 1500);
    
    // y=b^x 曲线（从左到右，在Y轴之后）
    animatePath(path1Ref.current, svgStartDelay + 3000);
    
    // y=a^x 曲线（从左到右，在y=b^x之后）
    animatePath(path2Ref.current, svgStartDelay + 5000);
  }, []);

  return (
    <div 
      className="min-h-screen w-full fixed inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${process.env.NODE_ENV === 'production' ? '/aiteacher' : ''}/bg@2x.webp')`,
      }}
    >
      {/* 主内容区域 */}
      <div 
        className="relative mx-auto z-10"
        style={{
          width: "100%",
          height: "100vh",
          paddingLeft: "clamp(16px, 2.08vw, 40px)",
          paddingRight: "clamp(16px, 2.08vw, 40px)",
          paddingTop: "clamp(16px, 2.08vw, 40px)",
          paddingBottom: "clamp(16px, 2.08vw, 40px)",
          boxSizing: "border-box"
        }}
      >
        {/* 主卡片 */}
        <div
          className="relative rounded-[40px] mx-auto"
          style={{ 
            width: "100%",
            height: "100%",
            maxWidth: "1840px",
            padding: "2px",
            background: "linear-gradient(180deg, #F0FFD9 0%, rgba(250, 255, 241, 0) 100%)",
            boxShadow: "none"
          }}
        >
          <div
            className="relative rounded-[40px] overflow-hidden w-full h-full flex flex-col"
            style={{ 
              background: "linear-gradient(180deg, rgba(220, 255, 201, 0.87) 0%, #FFFFFF 10%, #FFFFFF 100%)",
              boxShadow: "none"
            }}
          >
          {/* 上半部分：题目区域 */}
          <div 
            className="relative rounded-[40px] flex-shrink-0"
            style={{ 
              paddingLeft: "clamp(16px, 5.4vw, 104px)",
              paddingRight: "clamp(16px, 5.4vw, 104px)",
              paddingTop: "clamp(16px, 4.6vw, 88px)",
              paddingBottom: "clamp(16px, 1.1vw, 21px)",
              boxSizing: "content-box",
              boxShadow: "none"
            }}
          >
            {/* 题目文本 */}
            <div className="mb-6">
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
                {/* 选项 A */}
                <div className="flex items-center" style={{ gap: "clamp(8px, 0.9vw, 16px)" }}>
                  <div
                    className="flex items-center justify-center rounded-[40px] flex-shrink-0"
                    style={{
                      width: "clamp(36px, 3vw, 58px)",
                      height: "clamp(36px, 3vw, 58px)",
                      padding: "11px 16px",
                      background: "linear-gradient(111deg, #DCFFC9 -1%, #FFFFFF 111%)"
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{
                        fontSize: "clamp(16px, 1.9vw, 36px)",
                        background: "linear-gradient(324deg, #25C8A0 5%, #00D785 99%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}
                    >
                      A
                    </span>
                  </div>
                  <span 
                    className="text-[#3D3D3D]"
                    style={{ fontSize: "clamp(14px, 1.8vw, 24px)" }}
                  >
                    a&gt;b&gt;1
                  </span>
                </div>

                {/* 选项 B */}
                <div className="flex items-center" style={{ gap: "clamp(8px, 0.9vw, 16px)" }}>
                  <div
                    className="flex items-center justify-center rounded-[40px] flex-shrink-0"
                    style={{
                      width: "clamp(36px, 3vw, 58px)",
                      height: "clamp(36px, 3vw, 58px)",
                      padding: "11px 16px",
                      background: "linear-gradient(111deg, #DCFFC9 -1%, #FFFFFF 111%)"
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{
                        fontSize: "clamp(16px, 1.9vw, 36px)",
                        background: "linear-gradient(324deg, #25C8A0 5%, #00D785 99%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}
                    >
                      B
                    </span>
                  </div>
                  <span 
                    className="text-[#3D3D3D]"
                    style={{ fontSize: "clamp(14px, 1.8vw, 24px)" }}
                  >
                    0&lt;a&lt;b&lt;1
                  </span>
                </div>

                {/* 选项 C */}
                <div className="flex items-center" style={{ gap: "clamp(8px, 0.9vw, 16px)" }}>
                  <div
                    className="flex items-center justify-center rounded-[40px] flex-shrink-0"
                    style={{
                      width: "clamp(36px, 3vw, 58px)",
                      height: "clamp(36px, 3vw, 58px)",
                      padding: "11px 16px",
                      background: "linear-gradient(111deg, #DCFFC9 -1%, #FFFFFF 111%)"
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{
                        fontSize: "clamp(16px, 1.9vw, 36px)",
                        background: "linear-gradient(324deg, #25C8A0 5%, #00D785 99%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}
                    >
                      C
                    </span>
                  </div>
                  <span 
                    className="text-[#3D3D3D]"
                    style={{ fontSize: "clamp(14px, 1.8vw, 24px)" }}
                  >
                    2<sup>a</sup>&lt;2<sup>b</sup>
                  </span>
                </div>

                {/* 选项 D */}
                <div className="flex items-center" style={{ gap: "clamp(8px, 0.9vw, 16px)" }}>
                  <div
                    className="flex items-center justify-center rounded-[40px] flex-shrink-0"
                    style={{
                      width: "clamp(36px, 3vw, 58px)",
                      height: "clamp(36px, 3vw, 58px)",
                      padding: "11px 16px",
                      background: "linear-gradient(111deg, #DCFFC9 -1%, #FFFFFF 111%)"
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{
                        fontSize: "clamp(16px, 1.9vw, 36px)",
                        background: "linear-gradient(324deg, #25C8A0 5%, #00D785 99%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}
                    >
                      D
                    </span>
                  </div>
                  <span 
                    className="text-[#3D3D3D]"
                    style={{ fontSize: "clamp(14px, 1.8vw, 24px)" }}
                  >
                    b&gt;a&gt;1
                  </span>
                </div>
              </div>
            </div>

            {/* 难度等级和作答正确率 */}
            <div 
              className="flex items-center flex-wrap"
              style={{ gap: "40px" }}
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
              backdropFilter: "blur(40px)",
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
                            height: "clamp(12px, 1.2vw, 19px)", 
                            width: "clamp(300px, 35vw, 527px)",
                            bottom: "0",
                            left: "0"
                          }}
                        />
                        <span 
                          className="font-semibold text-[#018B50] relative z-10 inline-block"
                          style={{ fontSize: "clamp(16px, 2vw, 24px)" }}
                        >
                          第一步，分析指数函数图形特征
                        </span>
                      </div>
                      <div className="leading-relaxed">
                        {solutionLines.map((line, index) => (
                          <div
                            key={index}
                            style={{
                              opacity: visibleLines.includes(index) ? 1 : 0,
                              transform: visibleLines.includes(index) ? 'translateY(0)' : 'translateY(10px)',
                              transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                              marginBottom: index < solutionLines.length - 1 ? '0.5rem' : '0'
                            }}
                            dangerouslySetInnerHTML={{ __html: line }}
                          />
                        ))}
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
                    {/* 坐标轴 */}
                    <line
                      ref={line1Ref}
                      x1="39"
                      y1="478.5"
                      x2="629"
                      y2="478.5"
                      stroke="#3D3D3D"
                      strokeWidth="2"
                    />
                    <line
                      ref={line2Ref}
                      x1="39"
                      y1="478.5"
                      x2="39"
                      y2="79"
                      stroke="#3D3D3D"
                      strokeWidth="2"
                    />

                    {/* Y轴标签 */}
                    <text
                      x="170"
                      y="30"
                      fontSize="clamp(18px, 2vw, 24px)"
                      fill="#3D3D3D"
                      textAnchor="middle"
                      fontWeight="bold"
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
                    >
                      X
                    </text>

                    {/* 原点 */}
                    <text
                      x="225"
                      y="500"
                      fontSize="clamp(18px, 2vw, 24px)"
                      fill="#3D3D3D"
                      textAnchor="middle"
                      fontWeight="bold"
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
