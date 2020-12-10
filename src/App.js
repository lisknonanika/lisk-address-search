import React, { Component } from 'react';
import * as cryptography from '@liskhq/lisk-cryptography';
import { Mnemonic } from '@liskhq/lisk-passphrase';

import './App.css';

//Appクラス = Appコンポーネント(カスタムタグ)
class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      word: "",
      type: "2",
      count: "10000",
      account: {
        address: "",
        baddress: "",
        publickey: "",
        passphrase: "",
      }
    };
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectCount = this.onSelectCount.bind(this);
    this.onClickStart = this.onClickStart.bind(this);
    this.onClickCopy = this.onClickCopy.bind(this);
  }

  onChange(e){
    this.setState({
      word: e.target.value
    });
  }

  onSelect(e){
    this.setState({
      type: e.target.value
    });
  }

  onSelectCount(e){
    this.setState({
      count: e.target.value
    });
  }

  onClickStart(e){
    let _cnt = 0;
    this.setState({
      account: {
        address: "",
        baddress: "",
        publickey: "",
        passphrase: "",
      }
    });
    if(!window.confirm("検索中は画面がフリーズするよ。\n開始してもいい？\n-Freezes during search.\n-OK?")) return;

    if (this.state.word==="") {
      window.alert("\"Search Word\"は必須だよー\n-Required \"Search Word\"");
      return;
    }
    while(true) {
      _cnt += 1;
      const passphrase = Mnemonic.generateMnemonic();
      const { address, publicKey } = cryptography.getAddressAndPublicKeyFromPassphrase(passphrase);
      const addressBip32 = cryptography.getBase32AddressFromAddress(address);
      console.log(`${_cnt}: ${addressBip32}`);
      if ((this.state.type==="0" && addressBip32.startsWith(`lsk${this.state.word.toLowerCase()}`)) ||
          (this.state.type==="1" && addressBip32.endsWith(this.state.word.toLowerCase())) ||
          (this.state.type==="2" && addressBip32.indexOf(this.state.word.toLowerCase()) >= 0)) {
        
        this.setState({
          account: {
            address: addressBip32,
            baddress: cryptography.bufferToHex(address),
            publickey: cryptography.bufferToHex(publicKey),
            passphrase: passphrase,
          }
        });
        window.alert("見つかったよ！\n-Found!");
        break;
      }
      if (+this.state.count>0 && _cnt%+this.state.count===0) {
        if(!window.confirm(`${_cnt}回検索したけど見つかりません...\nまだ続ける？\n-Not Found..(Number of searches: ${_cnt})\n-Continue?`)) break;
      }
    }
  }

  onClickCopy(e){
    e.target.select();
    document.execCommand('copy');
    window.alert("コピーしました！\n-Copied!")
  }
  
  render() {
    return (
      <div className="App">
        <div className="link">
        by. <a href="https://twitter.com/ys_mdmg" target="_">mdmg</a>&nbsp;(<a href="https://explorer.lisk.io/address/5380827711560203827L" target="_">5380827711560203827L</a>)
        </div>

        <h1 style={{"marginBottom": "10px"}}>Lisk Address Search</h1>

        <div style={{"marginTop": "10px"}}>- Search Word -</div>
        <div>
          <input type="text" value={this.state.word} onChange={this.onChange} placeholder="e.g. favoriteword"/>
        </div>
        
        <div style={{"marginTop": "10px"}}>- Search Type -</div>
        <div>
          <select
            value={this.state.type}
            onChange={this.onSelect}>
            <option value="0">forward match</option>
            <option value="1">backward match</option>
            <option value="2">partial match</option>
          </select>
        </div>
        {this.state.type==="0"?<div className="example">e.g. lsk<span className="red">favoriteword</span>fkf4uufc4ovuabdvdru4gc49zz</div>:""}
        {this.state.type==="1"?<div className="example">e.g. lskonja1hdwzno9fkf4uufc4ovunb<span className="red">favoriteword</span></div>:""}
        {this.state.type==="2"?<div className="example">e.g. lskonjahd2z<span className="red">favoriteword</span>1ipun4dvdru4gc49zz</div>:""}
        
        <div style={{"marginTop": "10px"}}>- Number of Search -</div>
        <div>
          <select
            value={this.state.count}
            onChange={this.onSelectCount}>
            <option value="1000">1000 (about 10sec.)</option>
            <option value="5000">5000 (about 1min.)</option>
            <option value="10000">10000 (about 2min.)</option>
            <option value="30000">30000 (about 6min.)</option>
            <option value="50000">50000 (about 10min.)</option>
            <option value="0">Infinity</option>
          </select>
        </div>

        <div style={{"marginTop": "30px"}}>
        <button onClick={this.onClickStart}>Start</button>
        </div>

        <div style={{"marginTop": "30px"}}>- Result -</div>
        <div className="result">
          {this.state.account.address!==""?
          <textarea
            onClick={this.onClickCopy}
            rows="7"
            readOnly
            value={
              "{\n" +
              "  address: " + this.state.account.address + ",\n"+
              "  binaryAddress: " + this.state.account.baddress + ",\n"+
              "  publicKey: " + this.state.account.publickey + ",\n"+
              "  passphrase: " + this.state.account.passphrase + "\n"+
              "}"
            }
          >
          </textarea>
          : ""}
        </div>
      </div>
    );
  }
}

export default App;
