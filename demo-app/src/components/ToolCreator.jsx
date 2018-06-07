import React from 'react';

const ToolCreator = props => (
    <div> 
      <h4> Add a Workflow Tool </h4>
        <label>NAME:  <input id="toolName" type="text"/></label>
        <label>APPLICATION:  <input id="toolApp" type="text"/></label>
        <label>TYPE:  <input id="toolType" type="text"/></label>
        <label className="descL" >DESCRIPTION:  <input className="toolD" id="toolDesc" type="text"/></label>
        <button onClick={() => {
            // let toolName = document.getElementById("toolName").value;
            // let toolApp = document.getElementById("toolApp").value;
            // let toolType = document.getElementById("toolType").value;
            // let toolDescription = document.getElementById("toolDescription").value;
            console.log(toolName.value)
            props.onAddTool(toolName.value, toolApp.value, toolType.value, toolDesc.value);
            }}>Add New Tool
        </button>
    </div>
  );
  
  export default ToolCreator;
  