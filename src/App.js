import React, { Component } from 'react';
import './assets/css/main.css';
import './assets/css/util.css';
import template from './template';
var HTMLtoJSX = require('htmltojsx');
var babel = require('babel-standalone');


var converter = new HTMLtoJSX({
  createClass: true,
  outputClassName: 'App'
});

var theme = { __html: template() };

var MyComp = null;
var Wrapped = null;


class App extends Component {
  component = null;
  MyComp = null;

  constructor(){
    super();
    this.listRef = React.createRef();
  }

  handleChange(e){
    console.log('EVENT----')
    console.log(e)
    e.preventDefault()
    if (e.target.value)
    {
      if (!e.target.className.includes('has-val'))
        e.target.className += ' has-val';
    } else {
      if (e.target.className.includes(' has-val'))
      e.target.className = e.target.className.replace(' has-val','');
    }
    console.log('THIS----')
    console.log(this);
  }


  componentDidMount(){
  }

  logText(title,data){
    console.log(title);
    console.log(data);
  }


  babeliFy(){
    let output  = converter.convert(template())
    output = output.replace('var App =','');  
    output = output.replace("{'{'}",'{');
    output = output.replace("{'}'}",'}');
    output = output.replace(`"use strict";`, '')
    output = output.replace(/onchange="this.props.onChange"/g, 'onChange={this.props.onChange}')
    
    output = output.replace('React.createClass','createReactClass');

    this.logText('Generated Code:',output);

    let options = {
      presets: ["es2015"],
      plugins: ["transform-react-jsx"]
    };

    this.logText('React Preset',options);
    let transCode = babel.transform(output, options).code;
    transCode = 'MyComp = '+transCode.replace(`"use strict";`, '');
    eval(transCode);
    this.logText('Babel Transpile!', transCode)

  }

  wrapping(WrappedComp,inputJson){
    return class Wrapper extends Component{
      constructor(){
        super()
        this.data = inputJson;
      }
      render(){
        return <WrappedComp title={this.data.title} onChange={this.data.onChange}/>;
      }
    }
  }



  render() {
    // return (
    //   <div ref={this.listRef} dangerouslySetInnerHTML={theme} />
    // );
    this.babeliFy()

    MyComp.test = 'Title';
    this.logText('Instance', MyComp)
    Wrapped = this.wrapping(MyComp, {title:'HooraY!!!', onChange:this.handleChange})

    return <Wrapped/>;
  }
}

export default App;
