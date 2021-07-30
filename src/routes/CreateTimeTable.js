import React from "react";
import "styles/CreateTimeTable.css";

const CreateTimeTable = ({ userObj }) => {
  return (
    <div className="class_table">
      <table border="1">
        <tbody>
          <tr>
            <td>1교시</td>
            <td>
              <input type="text" className="class_time" />
            </td>
          </tr>
          <tr>
            <td>2교시</td>
            <td>
              <input type="text" className="class_time" />
            </td>
          </tr>
          <tr>
            <td>3교시</td>
            <td>
              <input type="text" className="class_time" />
            </td>
          </tr>
          <tr>
            <td>4교시</td>
            <td>
              <input type="text" className="class_time" />
            </td>
          </tr>
          <tr>
            <td>5교시</td>
            <td>
              <input type="text" className="class_time" />
            </td>
          </tr>
          <tr>
            <td>6교시</td>
            <td>
              <input type="text" className="class_time" />
            </td>
          </tr>
          <tr>
            <td>7교시</td>
            <td>
              <input type="text" className="class_time" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CreateTimeTable;
