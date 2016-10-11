urlBase = "http://localhost";
(function($) {
	$(function(){
		load_template();
	});
	
	function load_template() {
		var url = urlBase + '/templates.html?_'+(new Date().getTime())
		$.ajax({
			url: url,
			success: function(data){
				var templates = $(data);
				$.each(templates, function(k, v){
					console.log(v)
					console.log()
					if ('header' == $(v).attr('id')) {
						$('header').html($(v).html());
					}
					if ('footer' == $(v).attr('id')) {
						$('footer').html($(v).html());
					}
				});
				
			},
			contentType: 'text/plain; charset=UTF-8' 
		});
	}
	
})(jQuery)