
module.exports =  React.createClass({
  openSettings: function(e){
	  	var Settings = require('./settings.js')
  	  React.render(
                <Settings />,
                 document.getElementById('content')
      );
   },
  render: function() {
    return (
	<div className='navbar navbar-default navbar-fixed-top'>
		<div className='container'>
			<div className='navbar-header'>
				<a href='#' className='navbar-brand'>OpenStar<span id="loading-placeholder"></span></a>
			    <div className='navbar-brand navbar-brand-centered'>
					<span id='lookup_string'>Todas mis canciones</span>
					<form id='search_form' className='navbar-form' role='search'>
						<div className='input'>
							<input id='search_input' type='text' className='form-control pull-right' placeholder='Search'/>
						</div>
					</form>
				</div>
			</div>
			<div className='navbar-collapse collapse' id='navbar-main'>
				<ul className='nav navbar-nav navbar-right'>
						  <li><a href="#" onClick={this.openSettings}><span className="glyphicon glyphicon-adjust" aria-hidden="true"></span></a></li>
				</ul>
			</div>
		</div>
	</div>
    );
  }
});