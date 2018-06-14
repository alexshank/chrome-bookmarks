/*
 * global variables
 */
var branchLevel = 0;
var folders = [];
var folderIndex = 0;
var bookmarksArray = [];

/*
 * initialize the page
 */
window.onload = function () {

	// get the user's bookmarks, pass to anonymous function
	chrome.bookmarks.getTree(function (bookmarks) {
		
		// create tree for sidebar
		buildFolderAndChildren(bookmarks[0].children, 'sidebar-tree');
		
		// Search the bookmarks when entering a search keyword
		$('#search').on('input', searchBookmarks);
		
		// expand all folders if checkbox is checked
		$('#expand-checkbox').change(function(){
			if($(this).is(':checked')){
				$('.folderDiv').removeClass('collapsed');
			}else{
				$('.folderDiv').addClass('collapsed');
			}
		});
		
	});
	
};

/*
 * display bookmark tree in sidebar
 */
function buildFolderAndChildren(bookmarks, ParentDiv) {
	
	// create object that all children will go in
	var parentDiv = $('#' + ParentDiv);
	
	// add each bookmark object to the parentDiv
	bookmarks.forEach(function (bookmark) {
		
		// create <p> element for new folder or bookmark
		var P = document.createElement('p');
		P.className += P.className ? ' tree-item' : 'tree-item';
		
		// add branch level and folder index to <p>
		P.setAttribute('data-branch-level', branchLevel);
		P.setAttribute('data-folder-index', folderIndex);
		
		// set padding to <p> element according to branch level
		P.setAttribute('style', 'padding-left: ' + (branchLevel*30) + 'px');
		
		// add <p> element to parent div
		parentDiv.append(P);
		
		/*
		 * handle either bookmark of folder object
		 */
		if (bookmark.children) {		// folder
		
			// add folder object to folders array
			folders.push(bookmark);
			
			// add title to <p> element
			P.innerHTML += '<span class="glyphicon glyphicon-folder-open" aria-hidden="true" style="padding:10px"></span>' + bookmark.title;
			
			// add onclick function to <p> element (pass folder index)
			P.onclick = function(){
				$('#divForFolder' + P.dataset.folderIndex).toggleClass('collapsed');	// show/hide folder
			}
			
			// add folder class to <p> element
			P.className += P.className ? ' folder' : 'folder';
			
			// create <div> element for folder's children
			var childrenDiv = document.createElement('div');
			
			// set <div> element's ID based on folder index
			var id = 'divForFolder' + folderIndex;
			childrenDiv.setAttribute('id', id);
			
			// add <div> element to parent div
			parentDiv.append(childrenDiv);
			
			// mark children <div> element as folder div
			childrenDiv.className += childrenDiv.className ? ' folderDiv' : 'folderDiv';
			
			// increase branch level and folder index
			branchLevel++;
			folderIndex++;
			
			// recursively add all child folders (use non incremented folder index)
			buildFolderAndChildren(bookmark.children, id);
			
		}
		else{	// bookmark
			
			// add bookmark object to bookmark array
			bookmarksArray.push(bookmark);
		
			// add class for styling
			P.className += P.className ? ' bookmark' : 'bookmark';
			
			// add <span> element to <p> element
			var span = document.createElement('span');
			span.setAttribute('class','glyphicon glyphicon-chevron-right');
			span.setAttribute('aria-hidden','true');
			span.setAttribute('style','padding:5px');
			var anchor = document.createElement('a');
			anchor.setAttribute('href', bookmark.url);
			anchor.innerHTML = bookmark.title;
			P.appendChild(span);
			P.appendChild(anchor);
			
		}
	});
	
	// end of children, so go back a branch num
	branchLevel--;
	
}

/*
 * search through all the bookmarks and display results
 */
function searchBookmarks(){
	
	// clear the current results and get the query
	$('#main').html('');
	var query = $('#search').val();
	
	// don't display large results
	if(query.length < 2){

		// resize results area
		$('#main-column').width('0%');
		$('#sidebar').width('100%');

	}else{
		
		// resize results area
		$('#main-column').width("60%");
		$('#sidebar').width('40%');


		// check for results
		for(var i = 0; i < bookmarksArray.length; i++){
			if(bookmarksArray[i].title.toLowerCase().indexOf(query.toLowerCase()) != -1 || bookmarksArray[i].url.toLowerCase().indexOf(query.toLowerCase()) != -1){
				$('#main').append('<p><a href="'+ bookmarksArray[i].url +'">' + bookmarksArray[i].title + '</a></p>');
			}
		}
	
		// say if there are no results
		if($('#main').is(':empty') ){
			$('#main').html('<p>No results found.</p>');
		}


	}
	
	
}

/*
USE LATER MAYBE
// add mouse functionality to cell
$('#' + i).mousedown(function(event) {
	switch (event.which) {
		case 1:
			cellClicked(event.target.id);
			break;
		case 2:
			alert('Middle mouse button pressed.');
			break;
		case 3:
			event.preventDefault();
			break;
		default:
			alert('You have a strange mouse!');
	}
});
*/
