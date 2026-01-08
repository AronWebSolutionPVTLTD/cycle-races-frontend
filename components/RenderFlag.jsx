import Flag from "react-world-flags";
export  const renderFlag = (code) => {
    if (!code || typeof code !== 'string') {
      return <div style={{ width: "30px", height: "20px", marginRight: "10px", backgroundColor: "#f0f0f0", borderRadius: "2px" }} />;
    }
    
    try {
      return (
        <Flag 
          code={code.toUpperCase()} 
          style={{ width: "20px", height: "20px", marginRight: "0", borderRadius: "2px" }} 
        />
      );
    } catch (err) {
      console.warn(`Error rendering flag for code: ${code}`, err);
      return <div style={{ width: "30px", height: "20px", marginRight: "10px", backgroundColor: "#f0f0f0", borderRadius: "2px" }} />;
    }
  };