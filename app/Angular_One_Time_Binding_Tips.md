## 支持 :: (one time bind) 语法的指令

* ngBind
* ngBindHtml
* ngBindTemplate
* ngChecked
* ngClass
* ngDisabled
* ngHide
* ngHref
* ngIf
* ngInclude
* ngReadonly
* ngRepeat
* ngSelected
* ngShow
* ngSrc
* ngSrcset
* ngStyle
* ngSwitch
* ngValue

__one-time repeater + one-time component:__

```
<ul>
  <li ng-repeat="user in ::users">
    <custom-profile user="::user"></custom-profile>
  </li>
</ul>
```

__one-time repeater + track by:__
```
<ul>
  <li ng-repeat="user in ::users track by user.id"> <!-- doesn't make sense -->
    {{user.name}}
  </li>
</ul>
```

__repeater + track by + one-time component / one-time binding:__

Since track-by allows DOM to be reused with new model, if this DOM is bound using fronzen bindings the DOM will not update. This should be documented as expected behavior.

```
<ul>
  <li ng-repeat="user in users track by user.id">
     {{:: user.name }}  <!-- will never update -->
    <custom-profile user="::user"></custom-profile> <!-- will never update -->
  </li>
</ul>
```

Reference: [https://docs.google.com/document/d/1fTqaaQYD2QE1rz-OywvRKFSpZirbWUPsnfaZaMq8fWI/edit](https://docs.google.com/document/d/1fTqaaQYD2QE1rz-OywvRKFSpZirbWUPsnfaZaMq8fWI/edit)