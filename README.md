# adapt-inline-menu  
    
An Adapt framework *extension* to add menu over the pages. Its 

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/resources01.gif" alt="Resources in action">      

## Installation

Download the ZIP and extract into the src > extensions directory and run an appropriate Grunt task.

or

First, be sure to install the [Adapt Command Line Interface](https://github.com/cajones/adapt-cli), then from the command line run:-

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
