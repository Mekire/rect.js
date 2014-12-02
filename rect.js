/*
 * Contains a basic Rect class with which we can keep track of a sprite's 
 * location and dimensions.  Also supports basic rectangle collision detection.
 */


//Namespace check and creation.
if(typeof RECT !== 'undefined')
    alert("Namespace collision!");
else
    RECT = {};


RECT.Rect = function(x, y, w, h){
    /*
     * A basic object to keep track of a sprite's location and dimensions.
     * Accepts four integers for x-location, y-location, width, and height.
     * 
     * The four attributes of the rect can be accessed by name,
     * or by index:
     *     Rect.x=Rect[0]; Rect.y=Rect[1]; Rect.w=Rect[2]; Rect.h=Rect[3]
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
    Object.defineProperty(this, 0, {writable: true, value: x});
    Object.defineProperty(this, 1, {writable: true, value: y});
    Object.defineProperty(this, 2, {writable: true, value: w});
    Object.defineProperty(this, 3, {writable: true, value: h});
    RECT._makePropertyAlias(this, 0, 'x', true);
    RECT._makePropertyAlias(this, 1, 'y', true);
    RECT._makePropertyAlias(this, 2, 'w', true);
    RECT._makePropertyAlias(this, 3, 'h', true);
    RECT._makePropertyAlias(this, 0, 'left');
    RECT._makePropertyAlias(this, 1, 'top');
    RECT._makePropertyAlias(this, 2, 'width');
    RECT._makePropertyAlias(this, 3, 'height');
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
    RECT._makeMultiProperty(this, 'centerx', 'centery', 'center');
    RECT._makeMultiProperty(this, 0, 1, 'topleft');
    RECT._makeMultiProperty(this, 'right', 1, 'topright');
    RECT._makeMultiProperty(this, 0, 'bottom', 'bottomleft');
    RECT._makeMultiProperty(this, 'right', 'bottom', 'bottomright');
    RECT._makeMultiProperty(this, 'centerx', 1, 'midtop');
    RECT._makeMultiProperty(this, 'centerx', 'bottom', 'midbottom');
    RECT._makeMultiProperty(this, 0, 'centery', 'midleft');
    RECT._makeMultiProperty(this, 'right', 'centery', 'midright');
    RECT._makeMultiProperty(this, 2, 3, 'size', 'w', 'h');
};

RECT.Rect.prototype.collidePoint = function(x,y){
    /* 
     * Check if a point (given by x and y) overlaps the rectangle.
     * The left and top edge are inclusive; the bottom and right edge are not.
     */
    return ((this.x <= x && x < this.x+this.w) &&
            (this.y <= y && y < this.y+this.h));
};

RECT.Rect.prototype.collideRect = function(other){
    /*
     * Detect collisions between calling Rect and other (also a Rect instance).
     * Shared edges are not considered colliding.
     */
    return !(other.x >= this.right || other.right <= this.x || 
             other.y >= this.bottom || other.bottom <= this.y);
};


//Property descriptor factories.
RECT._makePropertyAlias = function(obj, original, alias, enumerate){
    /*
     * Create a property obj.alias that gets and sets the property 
     * original.alias (eg set and get Rect.w using Rect.width).
     */
    if(enumerate === undefined)
        enumerate = false;
    Object.defineProperty(obj, alias, {
        enumerable : enumerate,
        get: function(){return obj[original];},
        set: function(value){obj[original] = value;}
    });
};


RECT._makeMultiProperty = function(obj, prop1, prop2, name, var1, var2){
    /*
     * Create a property name that gets and sets both obj.prop1 and obj.prop2.
     * var1 and var2 can be used to set the attributes needed when assigning
     * by an explicit object rather than a two element array. 
     * 
     * eg 
     *     RECT._makeMultiProperty(this, 'w', 'h', 'size', 'w', 'h');
     * creates a property obj.size which will get and set obj.w and obj.h.
     * It can be assigned to by either:
     *     obj.size = [10, 30]; // two element array
     * or
     *     obj.size = {w: 10, h: 30}; // object with attributes var1 and var2
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
};
