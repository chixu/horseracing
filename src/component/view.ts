export abstract class View extends PIXI.Container {
    // components: Component[] = [];
    // id: string;
    // fadeInTime: number = -1;
    // fadeOutTime: number = -1;
    // fadeTween: TWEEN.Tween;
    // layoutInfo: any;
  
    // addChild(component) {
    //   if (component instanceof PIXI.DisplayObject) {
    //     super.addChild(component);
    //   }
    //   if (isComponent(component)) {
    //     if (component instanceof View) component.fadeIn();
    //     this.components.push(component);
    //     return component;
    //   }
    //   return undefined;
    // }
  
    // fadeIn(t?: number) {
    //   if (t === undefined) t = this.fadeInTime;
    //   if (t > 0) {
    //     if (this.fadeTween) this.fadeTween.stop();
    //     this.fadeTween = tween.fadeIn(this, t);
    //   }
    // }
  
    // fadeOut(t?: number, removeOnFadeOut: boolean = true) {
    //   if (t === undefined) t = this.fadeOutTime;
    //   if (t > 0) {
    //     if (this.fadeTween) this.fadeTween.stop();
    //     this.fadeTween = tween.fadeOut(this, t, removeOnFadeOut ? () => { if (this.parent) this.parent.removeChild(this) } : undefined);
    //   } else {
    //     if (removeOnFadeOut && this.parent) this.parent.removeChild(this);
    //   }
    // }
  
    // removeChild(component) {
    //   if (component instanceof PIXI.DisplayObject) {
    //     super.removeChild(component);
    //   }
    //   if (isComponent(component)) {
    //     array.remove(this.components, component);
    //     component.deactivate();
    //   }
    //   return component;
    // }
  
    // removeChildren(beginIndex?: number, endIndex?: number): PIXI.DisplayObject[] {
    //   this.removeAllComponents();
    //   return super.removeChildren(beginIndex, endIndex);
    // }
  
    // removeAllComponents() {
    //   this.deactivate();
    //   this.components = [];
    // }
  
    // activate() {
    //   this.fadeIn();
    //   this.components.forEach(x => x.activate());
    // }
  
    // deactivate() {
    //   if (this.fadeTween) this.fadeTween.stop();
    //   this.components.forEach(x => x.deactivate());
    // }
  
    // getComponentByID(id: string): Component {
    //   for (let i = 0; i < this.components.length; i++) {
    //     let comp1: Component = this.components[i];
    //     if (comp1.id === id) return comp1;
    //     let comp2: Component = comp1.getComponentByID(id);
    //     if (comp2) return comp2;
    //   }
    //   return undefined;
    // }
  
    // getComponentByTag(tag: string): Component {
    //   for (let component of this.components) {
    //     // let metadata = Reflect.getMetadata(REGISTER_METADATA_KEY, component.constructor) as RegisterMetadata;
    //     let metadata = component.constructor.prototype[REGISTER_METADATA_KEY] as RegisterMetadata;
    //     if (metadata && metadata.tag === tag) {
    //       return component;
    //     }
    //   }
    //   return undefined;
    // }
  
    getBounding() {
      return this.getBounds();
    }
  
    bringToTop(child) {
      this.setChildIndex(child, this.children.length - 1);
    }
  }