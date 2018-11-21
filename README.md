# adapt-inline-menu  
    
An Adapt framework *extension* to add menu over the pages.

<img src="https://github.com/kunjsharma/adapt-inline-menu/tree/master/assets/adapt-inline-menu.png" alt="Inline menu"> 

## Installation

Download the ZIP and extract into the src > extensions directory and run an appropriate Grunt task.

or run:

    adapt install inline-menu

## Usage

Add the `_inlineMenu` entry to the course:

```
        "_inlineMenu": {
        	"_isEnabled": true,
        	"title": "Menu",
        	"_items": [
	            {
	                "title": "Go to Menu",
	                "_link": ""
	            },
	            {
	                "title": "Presentation Components",
	                "_link": "co-05"
	            },
	            {
	                "title": "Question Components",
	                "_link": "co-10"
	            },
	            {
	                "title": "Adapt Assessment",
	                "_link": "co-15"
	            }
	        ]
	    }
```

* `title` Menu item title
* `_link` Link to page. Empty sends to main menu.


### Limitations

Developed for framework, not tested compatiblity with authoring.

### Browser/platform specification

Intended to develop standard Adapt browser/devices specifications.

----------------------------
**Version number:**  0.0.1 
**Framework versions:** 3.2.1      
**Author / maintainer:** Kunj B Sharma <kunjsharma@hotmail.com>     
