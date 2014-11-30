/*
 * Contains a basic Rect class with which we can keep track of a sprite's 
 * location and dimensions.  Also supports basic rectangle collision detection.
 */


function Rect(x, y, w, h) {
    /*
     * A basic object to keep track of a sprite's location and dimensions.
     * Accepts four integers for x-location, y-location, width, and height.
     * 
     * Aside from the four standard attributes (x,y,w,h), the Rect also has
     * a number of psuedo attributes:
     *     left, top, right, bottom, 
     *     centerx, centery, center
     *     midleft, midtop, midright, midbottom
     *     width, height, size
     * all of which can be assigned to.
     * 
     * When assigning to the multi-attributes:
     *     center, midleft, midtop, midright, midbottom, size
     * you can either use a two element array:
     *     rect.center = [0, 10];
     * or an object with two properly named elements:
     *     rect.center = {x: 0, y: 10};
     *     rect.size = {w: 100, h: 50};
     *     
     * When getting a multi-element value the result is always a two element
     * array.
     */
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    _makePropertyAlias(this, 'x', 'left');
    _makePropertyAlias(this, 'y', 'top');
    _makePropertyAlias(this, 'w', 'width');
    _makePropertyAlias(this, 'h', 'height');
    Object.defineProperty(this, 'right', {
        get: function(){return this.x+this.w;},
        set: function(value){this.x = value-this.w;}
    });
    Object.defineProperty(this, 'bottom', {
        get: function(){return this.y+this.h;},
        set: function(value){this.y = value-this.h;}
    });
    Object.defineProperty(this, 'centerx', {
        get: function(){return this.x+Math.floor(this.w/2);},
        set: function(value){this.x = value-Math.floor(this.w/2);}
    });
    Object.defineProperty(this, 'centery', {
        get: function(){return this.y+Math.floor(this.h/2);},
        set: function(value){this.y = value-Math.floor(this.h/2);}
    });
    _makeMultiProperty(this, 'centerx', 'centery', 'center');
    _makeMultiProperty(this, 'x', 'y', 'topleft');
    _makeMultiProperty(this, 'right', 'y', 'topright');
    _makeMultiProperty(this, 'x', 'bottom', 'bottomleft');
    _makeMultiProperty(this, 'right', 'bottom', 'bottomright');
    _makeMultiProperty(this, 'centerx', 'y', 'midtop');
    _makeMultiProperty(this, 'centerx', 'bottom', 'midbottom');
    _makeMultiProperty(this, 'x', 'centery', 'midleft');
    _makeMultiProperty(this, 'right', 'centery', 'midright');
    _makeMultiProperty(this, 'w', 'h', 'size', 'w', 'h');
}

Rect.prototype.collidePoint = function(x,y){
    /* 
     * Check if a point (given by x and y) overlaps the rectangle.
     * The left and top edge are inclusive; the bottom and right edge are not.
     */
    return ((this.x <= x && x < this.x+this.w) &&
            (this.y <= y && y < this.y+this.h));
};


function _makePropertyAlias(obj, original, alias){
    /*
     * Create a property obj.alias that gets and sets the property 
     * original.alias (eg set and get Rect.w using Rect.width).
     */
    Object.defineProperty(obj, alias, {
        get: function(){return obj[original];},
        set: function(value){obj[original] = value;}
    });
}


function _makeMultiProperty(obj, prop1, prop2, name, var1, var2){
    /*
     * Create a property name that gets and sets both obj.prop1 and obj.prop2.
     * var1 and var2 can be used to set the attribute needed when assigning
     * by an explicit object rather than a two element array. 
     * 
     * eg 
     *     _makeMultiProperty(this, 'w', 'h', 'size', 'w', 'h');
     * creates a property obj.size which will get and set obj.w and obj.h.
     * It can be assigned to by either:
     *     obj.size = [10, 30]; // a two element array
     * or
     *     obj.size = {w: 10, h: 30} // an object with attributes var1 and var2
     */
    if(var1 === undefined)
        var1 = "x";
    if(var2 === undefined)
        var2 = "y";
    Object.defineProperty(obj, name, {
        get: function(){return [obj[prop1], obj[prop2]];},
        set: function(value){
            if(value[var1] !== undefined && value[var2] !== undefined){
                obj[prop1] = value[var1];
                obj[prop2] = value[var2];
            }
            else{
                obj[prop1] = value[0];
                obj[prop2] = value[1];
            }
        }
    });
}
