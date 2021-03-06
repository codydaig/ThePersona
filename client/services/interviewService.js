angular.module('app')
  .service('interviewService', function ($http, broadcastService) {
    this.prompts = [];
    this.currentPromptsIndex = -1;
    this.currentPrompt = this.prompts[this.currentPromptsIndex];
    this.selectedPrompt = {};

    this.queryPrompts = (tag, callback) => {
      $http.get('http://localhost:3000/api/prompts', {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          tags: tag
        }
      })
        .then(({ data }) => {
          if (callback) {
            callback(null, data);
          }
        }, ({ data }) => {
          if (callback) {
            callback(data, null);
          }
        });
    };

    this.selectNumPrompts = (numPrompts, prompts) => {
      const len = prompts.length;
      const dupPrompts = prompts.slice();
      let count = numPrompts;
      let index;
      const currentPrompts = [];
      if (numPrompts === null || numPrompts > len) {
        count = len;
      }
      for (let i = 0; i < count; i += 1) {
        index = Math.floor(Math.random() * dupPrompts.length);
        currentPrompts.push(dupPrompts[index]);
        dupPrompts.splice(index, 1);
      }
      this.prompts = currentPrompts;
      return this.getPrompts();
    };

    this.selectPrompt = (prompt) => {
      this.selectedPrompt = prompt;
      return this.selectedPrompt;
    };

    this.getPrompts = () => this.prompts;

    this.getNextPrompt = () => {
      console.log('here are the prompts:', this.prompts);
      this.currentPromptsIndex = this.currentPromptsIndex + 1;
      broadcastService.send('update', this.currentPromptsIndex);
    };
  });
