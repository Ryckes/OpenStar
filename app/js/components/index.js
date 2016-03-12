
var NavBar = React.createClass({
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
						
				</ul>
			</div>
		</div>
	</div>
    );
  }
});
var SliderInfo = React.createClass({
	getInitialState () {
	return {item:""};		

 },	

	render: function() {
		return(
			<div>
	 <div className='row'>
	        <p className='text-center' id='current_title'>{this.state.item.title}</p>
        </div>
        <div className='row'>
	        <p className='text-center' id='current_author'>{this.state.item.artist}</p>
        </div>
        </div>
		)
	}
	
})
var SliderItem = React.createClass({



	render: function() {
	
	 var createItem = function(item, index) {
		 var image = item.remote!=undefined?item.image:'songs/'+item.name+'/'+item.cover
      return ( 
      <div key={index} className='cover' data-index={index}>
	      <a href='#'><img width='250' height='250' src={image}/></a>
		  <div className='cover-overlay' id='overlay'>
		      <div className='progress-container'>
		      	<div id={'progress_bar_'+index} className='c100 p0 hid'>
			  		<span id={'progress_label_'+index}>0%</span>
			  		<div className='slice'>
			  			<div className='bar'>
			  		</div>
			  <div className='fill'></div>
			</div>
			</div>
			</div>
			</div>
	   </div>
	  	)
    };
    if(this.props.items.length>0){
	    
    	return 	<div className='row'><div  id='slider' className='slider center' autofocus>{this.props.items.map(createItem)}</div></div>;
    }else{
	    return (
		    <div>
	    <div className='row'>
	    	 <p className='text-center' id='no-results'>Sin resultados</p>
	    	 
	     </div>
	    <div className='row'>
	    	 <p className='text-center' id='no-results-explanation'>Recuerda que puedes buscar canciones escribiendo en cualquier sitio.</p>
	    	 
	     </div>	
	     
	     </div>     
	     )
    }
    
	}

})
var Slider = React.createClass({
  finalSongs:[],
  localParseFinished:function(finalSongs){
	  
	 this.setState({items: finalSongs, selected:null});  
	  
  },
  parseLyrics:function(d){
	  var _this = this;
	 for(var name in d)
	 	(function(iter){
		  $.get("songs/"+d[iter]+"/"+d[iter]+".txt", function(data) {
		    var lyrics = window.Lyrics.parse(data);
		    lyrics["name"]=d[iter];	
		    _this.finalSongs.push(lyrics);
		    if(_this.finalSongs.length==d.length){ 
			    _this.localParseFinished(_this.finalSongs);
			}
		 })
		 })(name);
	


	  
	  
  },
  getInitialState () {
	ipc.send('getSavedSongs', null);
	var _this = this;	
    ipc.on("savedSongs", function(event, data){	
	    _this.parseLyrics(data);
		//_this.setState({items: data, selected:null});  
	})
	return {items: [], selected:null};		

 },	

componentDidUpdate:function(prevProps, prevState){
	var _this = this;
	 $(".slider").slick({
				  centerMode: true,
				  centerPadding: '60px',
				  slidesToShow: 3,
				  arrows:false,
				  infinite:true,
				  speed: 100,
				});
	_this.refs.slider_info.setState({item:_this.state.items[0]})
	$('.slider').on('afterChange', function(event, slick, currentSlide, nextSlide){
		_this.refs.slider_info.setState({item:_this.state.items[currentSlide], index:currentSlide})
	});
	$('.slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
				 	
	});
	$(".cover").click(function(){
		$(".slick-current").toggleClass("slick-current");
		_this.refs.slider_info.setState({item:_this.state.items[parseInt($(this).data("index"))]})
		$(this).toggleClass("slick-current");
	});
	$('.slider').focus();

	
},
	


render: function() {
    return (  <div>
		 	<SliderItem items={this.state.items} />
		 	<SliderInfo ref='slider_info' item={this.state.selected}/>
		 	</div>
		)
  }  
	
	
})
var MainPage = React.createClass({

  render: function() {
    return (    
	   <div className='container'>

      <div className='page-header' id='banner'>
         
        <Slider ref='slider'  />
				

          
       
        </div>
      </div>
    );
  
  }
});

function downloadSong(current, index) {
    return new Promise((resolve, _) => {
        ipc.send('download', current);
        //_this.setState({'downloading':true});
        //App.downloading=App.selected;
        $("#progress_bar_"+index).fadeIn();
        ipc.on("downloadProgress", function(event, arg){
            var progress = arg*100;
            $("#progress_label_"+index).html(parseInt(progress)+"%");
            $("#progress_bar_"+index).attr("class", "c100 p"+(parseInt(progress)));
        });
        ipc.on("downloadFinished", function(event, arg){
            $.get("songs/" + arg + "/" + arg + ".txt", function(data) {
                var lyrics = window.Lyrics.parse(data);
                lyrics["name"] = arg;
                React.render(
                        <Game song={lyrics}/>,
                    document.getElementById('content')
                );
                resolve();
            });
        });
    });
}

var loadingState = new function() {
    var step = 0,
        stepInterval = 400,
        timerId = null,
        requests = 0;

    function advanceStep() {
        step++;
        if (step === 4)
            step = 0;

        var text = '';
        var i = 0;
        while (i++ < step)
            text += '.';
        $('#loading-placeholder').text(text);

        // Undoes possible pop's
        $('#loading-placeholder').css('font-weight', 'normal');
    }

    function show() {
        if (requests === 0)
            timerId = setInterval(advanceStep,
                                  stepInterval);
        requests++;
    }

    function hide() {
        if (requests === 0) return;

        requests--;
        if (requests === 0) {
            clearInterval(timerId);
            step = 0;
            timerId = null;
            $('#loading-placeholder').text('');
        }
    }

    function pop() {
        $('#loading-placeholder').css('font-weight', 'bold');
    }

    this.show = show;
    this.hide = hide;
    this.pop = pop;
}();

function showSearchForm() {
    $("#lookup_string").hide();
    $("#search_form").show();
    $("#search_input").focus();
}

function hideSearchForm() {
    $('#lookup_string').text($('#search_input').val());
    $('#search_form').hide();
    $('#lookup_string').show();
}

module.exports = React.createClass({
    getInitialState () {
        var _this = this;
        var Game = require('./game.js');

        $( document ).keydown(function(e) {
            if(e.which == 27){
                document.location.href='index.html';
            }
            else if((e.which == 37 || e.which == 39) &&
                    $('.slider').is(':visible') &&
                    !$('#search_form').is(':visible')) {

                // Left and right arrow keys
                if (e.which == 37)
                    $('.slider').slick('slickPrev');
                else
                    $('.slider').slick('slickNext');
            }
        });

        $(document).ready(() => {
            $('#search_form').focusout(hideSearchForm);
        });

        $(document).keypress(function(e) {
            var pressedReturn = e.which == 13;
            if(!pressedReturn && !$("#search_form").is(":visible")) {
                showSearchForm();
            }
            if(pressedReturn && !$("#search_form").is(":visible")){
                // current = App.searchResults.length==0?App.finalSongs[App.selected]:App.searchResults[App.selected];
                var current = _this.refs.main.refs.slider.refs.slider_info.state.item;
                var index = _this.refs.main.refs.slider.refs.slider_info.state.index;

                if(current.remote != undefined){
                    if(_this.state.downloading == false){
                        _this.state.downloading = true;
                        loadingState.show();
                        downloadSong(current, index).then(() => {
                            _this.state.downloading = false;
                            loadingState.hide();
                        });
                    }
                    else {
                        console.debug('Tried to download while previous download was unfinished.');
                        loadingState.pop();
                    }
                }
                else {
                    React.render(
                            <Game song={current}/>,
                        document.getElementById('content')
                    );
                }
            }
            else {
                if(pressedReturn && $("#search_form").is(":visible")){
                    hideSearchForm();
                    loadingState.show();
                    ipc.send('search', $("#search_input").val());
                    ipc.on("results", function(event, arg){
                        $('.slider').slick('unslick');
                        _this.refs.main.refs.slider.setState({items:arg, selected:0});
                        loadingState.hide();
                    });
                    e.preventDefault();
                }
            }

        });
        return {downloading: false, index: 0};
    },

    render () {
        return (
	            <div>
	            <NavBar />
	            <MainPage ref='main' />
	            </div>

        )
    }
})
