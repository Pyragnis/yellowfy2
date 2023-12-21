
import "./App.css";
import { LeftMenu } from "../src/Components/LeftMenu";
import { MainContainer } from "../src/Components/MainContainer";
import { RightMenu } from "../src/Components/RightMenu";

function App() {
  return (
    <div className="App">
      <LeftMenu/> 
      <MainContainer/>
      <RightMenu/>
      <div className="background"> </div>
    </div>
  );
}

export default App;
