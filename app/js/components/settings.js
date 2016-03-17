var NavBar = require('./navbar.js');

module.exports = React.createClass({
	getInitialState () {
		Pitch.enumerateDevices();
		Pitch.init();
		Pitch.toggleLiveInput();
		return null;		
	},
	componentDidMount () {
	},
	
	
	render () {
	    return (
		     <div>
	            <NavBar />
	            <div className='container'>
	                  <div className='page-header' id='banner'>

					    <form id="settings-form">
			  <div className="form-group">
			    <label for="exampleInputEmail1">Microphone</label>
			    <select width="200px" className="form-control" id="micro_sel">
				  </select>
  
			  </div>
			  <div>
			  <div>
			  	<div className="soundBar">
			  		<div className="soundFill">
			  		</div>
			  	</div>
			  	<div className="pitchSample">
			  	</div>
			   </div>
			  </div>
			
			</form>
				            </div>
	              </div>
	              </div>

		    
		    
		)
		
	}
})