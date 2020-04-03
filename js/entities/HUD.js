/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function(x, y) {
        // call the constructor
        this._super(me.Container, 'init', [x, y]);

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        this.width = me.game.viewport.width;
        this.height = me.game.viewport.height;

        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;

        // add our child score object at the top left corner
        //this.addChild(new game.HUD.ScoreItem(-10, -10));


        const leftSettings = {
            name: 'JoystickLeft',
            x: 10,
            y: me.game.viewport.height - 170,
            width: 160,
            height: 160,
        };

        const rightSettings = {
            name: 'JoystickRight',
            x: me.game.viewport.width - 170,
            y: me.game.viewport.height - 170,
            width: 160,
            height: 160,
        };

        const JoystickLeft = new game.HUD.JoystickContainer(leftSettings.x, leftSettings.y, leftSettings);
        const JoystickRight = new game.HUD.JoystickContainer(rightSettings.x, rightSettings.y, rightSettings);

        this.addChild(JoystickLeft, 2);
        this.addChild(JoystickRight, 1);

        const shootSettings = {
            name: 'ShootEntity',
            x: me.game.viewport.width - 180,
            y: me.game.viewport.height - 180,
            width: 80,
            height: 80,
            frameheight: 80,
            framewidth: 80,
            image: 'shoot-control',
        };

        me.pool.register("ShootEntity", game.HUD.UiShootEntity);
        this.addChild(me.pool.pull("ShootEntity", shootSettings.x, shootSettings.y, shootSettings), 3);

        this.updateChildBounds();
    }
});

game.HUD.JoystickContainer = me.Container.extend({

    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Container, 'init', [x, y]);

        // persistent across level change
        // this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = settings.name;

        this.width = 160;
        this.height = 160;

        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;

        // add a physic body
        // this.body = new me.Body(this);
        // this.body.gravity = 0;

        //this.setPoints()new Vector2d(xopt, yopt);
        //this.setShape(this.x, this.y, this.width, this.height);


        const topSettings = {
            name: 'UiTopEntity',
            x: 32,
            y: 30,
            width: 96,
            height: 100,
            frameheight: 100,
            framewidth: 96,
            image: 'top',
        };

        const bottomSettings = {
            name: 'UiBottomEntity',
            x: 0,
            y: 0,
            width: 160,
            height: 160,
            frameheight: 160,
            framewidth: 160,
            image: 'bottom',
        };

        me.pool.register("UiTopEntity", game.HUD.UiTopEntity);
        me.pool.register("UiBottomEntity", game.HUD.UiBottomEntity);

        this.addChild(me.pool.pull("UiTopEntity", topSettings.x, topSettings.y, topSettings), 2);
        this.addChild(me.pool.pull("UiBottomEntity", bottomSettings.x, bottomSettings.y, bottomSettings), 1);

        this.updateChildBounds();
    }
});

game.HUD.UiTopEntity = me.Entity.extend({
    /**
     * constructor
     */
    init : function (x, y, settings) {

        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);


        this.body.gravity = 0;

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

    },

});

game.HUD.UiBottomEntity = me.Entity.extend({
    /**
     * constructor
     */
    init : function (x, y, settings) {

        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);


        this.body.gravity = 0;

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

    },

});

/**
 * a shoot entity
 */
game.HUD.UiShootEntity = me.GUI_Object.extend({
    /**
     * constructor
     */
    init : function (x, y, settings) {

        // call the constructor
        this._super(me.GUI_Object, 'init', [x, y, settings]);

    },

    // output something in the console
    // when the object is clicked
    onClick:function (event)
    {
        me.event.publish("shoot");
        // don't propagate the event
        return false;
    }
});

/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend( {
    /**
     * constructor
     */
    init : function (x, y) {
        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create the font object
        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));

        // font alignment to right, bottom
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function (dt) {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (renderer) {
        // this.pos.x, this.pos.y are the relative position from the screen right bottom
        this.font.draw (renderer, game.data.score, me.game.viewport.width + this.pos.x, me.game.viewport.height + this.pos.y);
    }
});
