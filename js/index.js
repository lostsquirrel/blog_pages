
(function($) {

	order = null;
	tag = null;
	$(function() {
		// jQuery ready stuff.
		$('#save').click(function(){
			var title = $('input[name=title]').val();
			var url = urlBase + "/blog/0";
			$.post(url, {title: title}, function(data){
				alert(data.msg);
				load_articles();
			});
		});
		
		$('.container').on('click', '.vote_action', function(e){
			var article_id = $(e.target).parent('div').attr('id');
//			console.log(article_id)
			var vote_action = 'up';
			if ($(e.target).hasClass('up')) {
				console.log('xxxx')
			} else {
				console.log('oooo')
			}
//			article_id = article_id.replace("_", ":")
			var url = urlBase + "/blog/vote/" + article_id
			$.post(url, {vote_action: vote_action}, function(data){
				
				var result = data.result;
				console.log(data.article_id)
				if (result > 0) {
					$('#' + data.article_id).find("span:first").text(result);
				} else {
					var msg = '出错了';
					if ('-1' == result) {
						msg = "文章发布超过一周，不能投票！"
					} else if ('-2' == result) {
						msg = "您已经对投过此文章了，谢谢！"
					}
					alert(msg);
				}
			}, 'json');
		});
		
		$('.container').on('click', '.add_tag', function(e){
			var tags = $(e.target).parent('div').find('.tag').val();
			if (tags){
				
				var article_id = $(e.target).parent('div').attr('id');
				var url = urlBase + '/blog/tag';
				$.ajax({url: url,
					data: {tags: tags, article_id: article_id},
					method: 'put',
					dataType:'json',
					complete: function(data){
						load_tags();
						$(e.target).parent('div').find('.tag').val('');
					}
				});
			}
		});
		$('.container').on('click', '.remove_tag', function(e){
			var tags = $(e.target).parent('div').find('.tag').val();
			if (tags){
				
				var article_id = $(e.target).parent('div').attr('id');
				var url = urlBase + '/blog/tag';
				$.ajax({url: url,
					data: {tags: tags, article_id: article_id},
					method: 'delete',
					dataType:'json',
					complete: function(data){
						load_tags();
						$(e.target).parent('div').find('.tag').val('');
					}
				});
			}
		});
		
		$('#one .score_time a').click(function(e){
			e.preventDefault();
			$('#one .score_time a').removeClass('on');
			order = $(e.target).attr("order")+ ":";
			$(e.target).addClass('on');
			load_articles(order, tag);
		});
		
		$('#one .tags').on('click', 'a', function(e){
			e.preventDefault();
			$('#one .tags').find('a').removeClass('on');
			tag = $(e.target).attr("tag");
			$(e.target).addClass("on")
			load_articles(order, tag);
		});
		
		$('#change_user').click(function(){
			var user = $('#user').val();
			if (user) {
				var url = urlBase + "/blog/user";
				$.post(url, {user: user}, function(){
					load_user();
				});
			}
		});
		load_user();
		load_tags();
		load_articles();
	});

	function load_articles(order) {
		return load_articles(order, null);
	}
	
	function load_articles(order, tag) {
		var url = urlBase + '/blog';
		var param = {};
		
		if (order) {
			param.order = order;
		}
		if (tag) {
			param.tag = tag;
		}
		
		$.getJSON(url, param, function(data){
			show_articles(data);
		});
	}
	
	function load_articles_by_tag(tag) {
		load_articles(null, tag)
	}
	
	function load_tags() {
		var url = urlBase + '/blog/tag';
		$.getJSON(url, function(data){
			show_tags(data);
		});
	}
	
	function show_tags(tags) {
		var html = '<span><a href="#" class="on">全部</a></span> ';
		$.each(tags, function(k, tag){
			tag = tag.split(":")[1];
			html += '<span><a href="#" tag="'+tag+'">'+tag+'</a></span> ';
		});
		$('#one .tags').html(html);
	}
	
	function load_user() {
		var url = urlBase + "/blog/user";
		$.get(url, function(data) {
			$('#current_user').text(data);
		});
		
	}
	
	function show_articles(articles) {
		var html = '';
		$.each(articles, function(k, v){
			html += create_article(v);
		});
		$('#one .container').html(html);
	}
	
	function create_article(article) {
		var content = '';
		var article_id = article.id.split(':')[1];
		content += '<div id="'+article_id+'" class="article"> ';
		content += '<span class="votes">'+article.votes+'</span> ';
		var d = new Date(Math.round(article.time * 1000));
		var ds = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();
		ds += ' ';
		ds += d.getHours() + ':' +d.getMinutes()+':'+ d.getSeconds() + '.' + d.getMilliseconds();
		
		content += '<span class="time">'+ds+'</span> ';
		content += '<a href="'+article.link+'" title="'+article.title+'" target="_blank">'+article.title+'</a> ';
		content += '<button class="up vote_action">顶</button> ';
		content += '<input type="button" class="remove_tag" value="删除标签" />';
		content += '<input type="button" class="add_tag" value="添加标签" />';
		content += '<input type="text" class="tag" placeholder="添加标签, 多个逗号分隔" />';
//		content += '<span style="clear:both">&nbsp;</span> ';
//		content += '<button class="down vote_action">踩</button>';
		content += '</div>';
		return content;
	}
})(jQuery);