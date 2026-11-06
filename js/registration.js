(() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const readList = key => { try { const value=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(value)?value:[]; } catch { return []; } };
  const save = (key,list,message) => { try { localStorage.setItem(key,JSON.stringify(list)); return true; } catch { message.innerHTML='<strong>Could not save this request.</strong> Check browser storage settings and try again.'; message.hidden=false; return false; } };
  const fieldError = (form,key,text) => { const node=form.querySelector(`[data-error="${key}"]`); if(node)node.textContent=text; const input=form.elements.namedItem(key); if(input)input.setAttribute('aria-invalid','true'); };
  const clearForm = form => { form.querySelectorAll('.field-error').forEach(node=>node.textContent=''); form.querySelectorAll('[aria-invalid]').forEach(node=>node.removeAttribute('aria-invalid')); const message=form.querySelector('.form-message'); if(message)message.hidden=true; };
  const esc = value => { const node=document.createElement('span'); node.textContent=value; return node.innerHTML; };

  document.addEventListener('submit',event=>{
    const form=event.target;
    if(form.id==='host-form'){
      event.preventDefault(); clearForm(form);
      const data={name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),phone:form.elements.phone.value.replace(/\D/g,''),eventTitle:form.elements.eventTitle.value.trim(),category:form.elements.category.value,date:form.elements.date.value,time:form.elements.time.value.trim(),price:form.elements.price.value.trim(),venue:form.elements.venue.value.trim(),description:form.elements.description.value.trim()};
      const issues={}; if(data.name.length<2)issues.name='Please enter your name.'; if(!emailPattern.test(data.email))issues.email='Enter a valid email address.'; if(!/^\d{10}$/.test(data.phone))issues.phone='Enter a valid 10 digit Indian phone number.'; if(data.eventTitle.length<3)issues.eventTitle='Please enter an event name.'; if(!window.KEVENT_CATEGORIES.includes(data.category))issues.category='Choose an event category.'; if(!data.date||data.date<new Date().toISOString().slice(0,10))issues.date='Choose today or a future date.'; if(!data.time)issues.time='Add an event time.'; if(!data.price)issues.price='Add a ticket price or enter Free.'; if(!data.venue)issues.venue='Add a venue and city.'; if(data.description.length<15)issues.description='Add a short description (at least 15 characters).';
      if(Object.keys(issues).length){Object.entries(issues).forEach(([key,value])=>fieldError(form,key,value));form.querySelector('[aria-invalid]')?.focus();return;}
      const message=form.querySelector('.form-message'),hosted=readList('vybeHostedEvents'); const imageSource=window.KEVENTS.find(item=>item.category===data.category)||window.KEVENTS[0]; const newEvent={...data,title:data.eventTitle,id:`host-${Date.now().toString(36)}`,image:imageSource.image,hostName:data.name,hostEmail:data.email,hostPhone:data.phone,createdAt:new Date().toISOString()};hosted.unshift(newEvent); if(!save('vybeHostedEvents',hosted,message))return;
      localStorage.setItem('vybeActiveProfileEmail',data.email.toLowerCase());
      message.innerHTML=`<strong>Your event is live, ${esc(data.name)}.</strong>“${esc(data.eventTitle)}” is now listed in Explore and saved in your profile. <a href="index.html#explore">View event listing →</a> <a href="profile.html">Open your profile →</a>`; message.hidden=false; form.reset();window.dispatchEvent(new CustomEvent('vybe:event-published',{detail:newEvent}));return;
    }
    if(form.matches('.reservation-form')){
      event.preventDefault(); clearForm(form);
      const data={name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),phone:form.elements.phone.value.replace(/\D/g,''),eventId:form.elements.eventId.value};
      const issues={}; if(data.name.length<2)issues.name='Please enter your full name.'; if(!emailPattern.test(data.email))issues.email='Enter a valid email address.'; if(!/^\d{10}$/.test(data.phone))issues.phone='Enter a valid 10 digit Indian phone number.';
      const selected=window.KEVENTS.find(item=>item.id===data.eventId); if(!selected)issues.name='This event is no longer available.';
      if(Object.keys(issues).length){Object.entries(issues).forEach(([key,value])=>fieldError(form,key,value));form.querySelector('[aria-invalid]')?.focus();return;}
      const message=form.querySelector('.form-message'),reservations=readList('vybeRegistrations');
      if(reservations.some(item=>item.eventId===data.eventId&&item.email.toLowerCase()===data.email.toLowerCase())){message.innerHTML=`<strong>You’re already on the list.</strong>A reservation for ${esc(selected.title)} is saved with ${esc(data.email)}.`;message.hidden=false;return;}
      const bookedAt=new Date().toISOString();
      const ticket={ticketCode:`VYB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,eventId:selected.id,eventTitle:selected.title,date:selected.date,time:selected.time,venue:selected.venue,price:selected.price};
      reservations.push({...data,eventTitle:selected.title,createdAt:bookedAt,ticket}); if(!save('vybeRegistrations',reservations,message))return;
      localStorage.setItem('vybeActiveProfileEmail',data.email.toLowerCase());
      message.innerHTML=`<strong>You’re on the list, ${esc(data.name)}.</strong>Your place for ${esc(selected.title)} is saved. Ticket ${esc(ticket.ticketCode)} is ready. <a href="profile.html">View your ticket in your profile →</a>`; message.hidden=false; form.reset(); form.elements.eventId.value=selected.id;
    }
  });
})();
