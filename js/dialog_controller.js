/**
 * Generic Dialog Controller.
 * 
 * Currently supports Chrome Like design and keyboard friendly shortcuts.
 *
 * @abstract
 * @constructor
 */
DialogController = function (domID)
{
  this.id = domID;
  this.dialog = null;
  this.eventMap = {};
  this.onDialogKeyPressed = this.onDialogKeyPressed.bind(this);
  this.headerText = 'Dialog';
  this.okText = 'Ok';
  this.cancelText = 'Cancel';
};

/**
 * @param {number} OK Button State.
 * @const
 */
DialogController.OK = 1;

/**
 * @param {number} CANCEL Button State.
 * @const
 */
DialogController.CANCEL = 2;

/**
 * Sets the template for the dialog. Currently just supports changing the text.
 */
DialogController.prototype.setTemplate = function (tpl)
{
  if (tpl.header) this.headerText = tpl.header;
  if (tpl.ok) this.okText = tpl.ok;
  if (tpl.cancel) this.cancelText = tpl.cancel;
};

/**
 * Initializes the dialog by creating the DOM.
 */
DialogController.prototype.init = function() 
{
  this.dialog = this.createDOM($(this.id));
  this.dialog.style.display = 'none';
};

/**
 * Event registration. Currently just supports three events.
 *    destroy: When the dialog has been destroyed.
 *       clck: When the Cancel or OK button has been clicked.
 *       load: When the dialog has been loaded.
 */
DialogController.prototype.addEventListener = function (event, callback) 
{
  switch (event) {
    case 'destroy':
    case 'click':
    case 'load':
      this.eventMap[event] = callback;
      break;
    default:
      console.error('Event [' + event + '] does not exist for Dialog Controller.');
  }
};

/**
 * Constructs the Dialog DOM based where its contents is defined in the |dom|.
 */
DialogController.prototype.createDOM = function (dom)
{
  var dialog = createElement('div', {'class': 'dialog', 'id': dom.id});
  var page = createElement('div', {'class': 'page'});
  var header = createElement('h1', {'html': this.headerText});
  var contentArea = createElement('div', {'class': 'content-area'});
  var actionArea = createElement('div', {'class': 'action-area'});
  var buttonOk = createElement('button', {'id': 'dialog-ok', 'html': this.okText});
  var buttonCancel = createElement('button', {'id': 'dialog-cancel', 'html': this.cancelText});
  
  dialog.appendChild(page);
  page.appendChild(header);
  page.appendChild(contentArea);
  page.appendChild(actionArea);
  actionArea.appendChild(buttonOk);
  actionArea.appendChild(buttonCancel);
  
  // Listeners.
  buttonOk.addEventListener('click', this.onOk.bind(this), false);
  buttonCancel.addEventListener('click', this.onCancel.bind(this), false);
  
  // Lazy-load.
  var parent = dom.parentNode;
  parent.removeChild(dom);
  contentArea.innerHTML = dom.innerHTML;
  delete dom;
  parent.appendChild(dialog);
  
  return dialog;
};

/**
 * On Dialog Key Button hit.
 */
DialogController.prototype.onDialogKeyPressed = function (e)
{
  if (e.keyCode  == 27) { // ESCAPE.
    this.onCancel();
  }
  else if (e.keyCode == 13) { // ENTER.
    this.onOk();
  }
};

/**
 * On Dialog ok Event.
 */
DialogController.prototype.onOk = function ()
{
  if (this.eventMap.click) {
    this.eventMap.click(DialogController.OK);
  }
};

/**
 * On Dialog cancelled Event.
 */
DialogController.prototype.onCancel = function ()
{
  if (this.eventMap.click) {
    this.eventMap.click(DialogController.CANCEL);
  }
  this.setVisible(false);
};

/**
 * Sets the visibility of the Dialog to |v| and set necessary components.
 */
DialogController.prototype.setVisible = function (v) 
{
  this.dialog.style.display = v ? '-webkit-box' : 'none';
  if (v) {
    if (this.eventMap.load) {
      this.eventMap.load();
    }
    window.addEventListener('keyup', this.onDialogKeyPressed, false);
  }
  else {
    if (this.eventMap.destroy) {
      this.eventMap.destroy();
    }
    window.removeEventListener('keyup', this.onDialogKeyPressed, false);
  }
}