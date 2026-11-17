Modal overlay for confirmations/focused tasks.

```jsx
<Dialog open={open} onClose={close} title="Archive project?"
  actions={<><Button variant="secondary" onClick={close}>Cancel</Button><Button variant="danger" onClick={archive}>Archive</Button></>}>
  This can be undone from Settings within 30 days.
</Dialog>
```
