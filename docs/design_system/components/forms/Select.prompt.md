Native select dropdown styled to match Input.

```jsx
<Select label="Status" value={status} onChange={e=>setStatus(e.target.value)}
  options={[{value:'active',label:'Active'},{value:'done',label:'Completed'}]}/>
```
