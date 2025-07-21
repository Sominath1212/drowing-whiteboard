import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs";

function Room({ socket, userData, users }) {
  console.log(users);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("");
  const [lineWidth, setLineWidth] = useState(5); // Default line width

  const roughGenerator = rough.generator();
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [elements, setElements] = useState([]);

  const [img, setImg] = useState(null);
  useEffect(() => {
    socket.on("whiteBoardDataResponse", (data) => {
      setImg(data.imgURL);
    });
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.height = window.innerHeight * 2;
      canvas.width = window.innerWidth * 2;
      const context = canvas.getContext("2d");
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineCap = "round";
      contextRef.current = context;
    }
  }, []);

  useEffect(() => {
    contextRef.current.strokeStyle = color;
  }, [color]);
  useEffect(() => {
    contextRef.current.lineWidth = lineWidth;
  }, [lineWidth]);

  useLayoutEffect(() => {
    console.log(tool);
    if (canvasRef) {
      const roughCanvas = rough.canvas(canvasRef.current);

      if (elements.length > 0) {
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
      elements.forEach((element) => {
        if (element.type === "pencil") {
          roughCanvas.linearPath(element.path, {
            roughness: 0,
            stroke: element.strock,
            strokeWidth: lineWidth,
          });
        } else if (element.type === "line") {
          roughCanvas.draw(
            roughGenerator.line(
              element.offsetX,
              element.offsetY,
              element.width,
              element.height,
              {
                roughness: 0,
                stroke: element.strock,
                strokeWidth: lineWidth,
              }
            )
          );
        }
      });

      const canvasImage = canvasRef.current.toDataURL();
      socket.emit("whiteboardData", canvasImage);
    }
  }, [elements]);

  useEffect(() => {
    socket.on("whiteBoardDataResponse", (data) => {
      setImg(data?.imageURL);
    });
  }, []);
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(offsetX, offsetY);

    if (tool === "pencil") {
      //drow pencil logic
      setElements((prevElement) => [
        ...prevElement,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          strock: color,
        },
      ]);
    } else if (tool === "line") {
      setElements((prevElement) => [
        ...prevElement,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          strock: color,
        },
      ]);
    }
    setIsDrawing(true);
  };
  const handleMouseUp = (e) => {
    // console.log("muose up", e);
    const { offsetX, offsetY } = e.nativeEvent;
    console.log(offsetX, offsetY);
    setIsDrawing(false);
  };
  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;

    setElements((prev) => {
      const newElements = prev.map((el, index) => {
        if (index === prev.length - 1 && el.type === "pencil") {
          const updated = {
            ...el,
            path: [...el.path, [offsetX, offsetY]],
          };

          // Emit this stroke to others
          socket.emit("draw-stroke", updated);

          return updated;
        }
        return el;
      });

      return newElements;
    });
  };

  // code for better drowing

  // const handleMouseMove = (e) => {
  //   if (!isDrawing) return;

  //   const { offsetX, offsetY } = e.nativeEvent;

  //   setElements((prev) => {
  //     const updatedElements = [...prev];
  //     const lastIndex = updatedElements.length - 1;
  //     const lastElement = updatedElements[lastIndex];

  //     if (!lastElement) return prev;

  //     if (lastElement.type === "pencil") {
  //       const updated = {
  //         ...lastElement,
  //         path: [...lastElement.path, [offsetX, offsetY]],
  //       };
  //       updatedElements[lastIndex] = updated;
  //       socket.emit("draw-stroke", updated);
  //     } else if (lastElement.type === "line") {
  //       const updated = {
  //         ...lastElement,
  //         width: offsetX,
  //         height: offsetY,
  //       };
  //       updatedElements[lastIndex] = updated;
  //       socket.emit("draw-stroke", updated);
  //     }

  //     return updatedElements;
  //   });
  // };

  useEffect(() => {
    // if (userData.host) return; // only viewers listen

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);
    context.lineJoin = "round";
    context.lineCap = "round";
    socket.on("draw-stroke", (stroke) => {
      if (stroke.type === "pencil") {
        roughCanvas.linearPath(stroke.path, {
          stroke: stroke.stroke,
          strokeWidth: stroke.lineWidth,
          roughness: 0,
        });
      } else if (stroke.type === "line") {
        roughCanvas.draw(
          generator.line(
            stroke.offsetX,
            stroke.offsetY,
            stroke.width,
            stroke.height,
            {
              stroke: stroke.stroke,
              roughness: 0,
              strokeWidth: stroke.lineWidth,
            }
          )
        );
      }
    });

    return () => socket.off("draw-stroke");
  }, []);
  // end
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      const context = canvas.getContext("2d");
      context.fillReact = "white";
      // Clear the entire rectangular area of the canvas
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      setElements([]);
    }
  };
  // Function to handle color change (now takes a specific color string)
  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (contextRef.current) {
      contextRef.current.strokeStyle = newColor; // Update context stroke style
    }
  };

  // Function to handle stroke width change
  const handleLineWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10); // Parse value to integer
    console.log(newWidth);

    setLineWidth(newWidth);
    if (contextRef.current) {
      contextRef.current.lineWidth = newWidth; // Update context line width
    }
  };

  return (
    <div className="w-full h-full  flex flex-col items-center justify-center">
      <div>
        <h1 className="font-bold text-4xl">well-come to whiteboard.com</h1>

        <h1>Connected users {users.length}</h1>
      </div>
      <div className="flex items-center justify-center ">
        <div className="flex gap-5 items-center justify-center px-10 my-3 align-baseline border rounded ">
          <div className="flex items-center gap-1">
            <input
              type="radio"
              name="tool"
              id="pencil"
              value="pencil"
              onChange={(e) => setTool(e.target.value)}
            />
            <label htmlFor="pencil">Pencil</label>
          </div>
          <div className="flex items-center justify-center gap-1">
            <input
              type="radio"
              name="tool"
              id="line"
              value="line"
              onChange={(e) => setTool(e.target.value)}
            />
            <label htmlFor="line">Line</label>
          </div>
          <div className="flex items-center justify-center gap-1">
            <input
              type="color"
              name="tool"
              id="color"
              value="color"
              onChange={(e) => handleColorChange(e.target.value)}
            />
            <label htmlFor="color">Color</label>
          </div>
          <div className="flex items-center justify-center gap-1">
            <button
              className="bg-red-500 rounded cursor-pointer hover:bg-red-600 px-3 py-1 m-1"
              onClick={clearCanvas}
            >
              Clear
            </button>

            {/* Stroke Width Slider */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="lineWidthSlider"
                className="text-gray-700 font-medium"
              >
                Stroke Width:
              </label>
              <input
                type="range"
                id="lineWidthSlider"
                min="1"
                max="20"
                value={lineWidth}
                onChange={handleLineWidthChange}
                className="w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                title="Adjust stroke width"
              />
              <span className="text-gray-700">{lineWidth}px</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className=" border border-dark h-[100%] w-[100%] "
        onMouseDown={userData.host ? handleMouseDown : undefined}
        onMouseMove={userData.host ? handleMouseMove : undefined}
        onMouseUp={userData.host ? handleMouseUp : undefined}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default Room;
