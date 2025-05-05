import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const HowToUse = () => {
  return (
    <>
      {/* Breadcrumb Area */}
      <div className="main-content">
        <div className="breadcrumb-area breadcarumb-style-1 pt--180 pb--100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-inner text-center">
                  <h3 className="title h3">How to use</h3>
                  <ul className="page-list">
                    <li className="rainbow-breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="rainbow-breadcrumb-item active">How to use</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use Content */}
      <div className="rbt-utilize-area rainbow-section-gap-big">
        <div className="container">
          <div className="utilize-inner">
            <div className="row g-5">
              {/* Sidebar */}
              <div className="col-lg-3">
                <div className="rbt-default-sidebar sticky-top rbt-shadow-box">
                  <div className="inner">
                    <div className="content-item-content">
                      <div className="rbt-default-sidebar-wrapper">
                        <nav className="mainmenu-nav">
                          <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                            <li className="has-submenu">
                              <a className="collapse-btn" data-bs-toggle="collapse" href="#getstarted" role="button" aria-expanded="true" aria-controls="getstarted">
                                <span>Getting started</span>
                              </a>
                              <div className="show" id="getstarted">
                                <ul className="submenu rbt-default-sidebar-list">
                                  <li>
                                    <a href="#text-generator-sec">
                                      <span>Connect with AI text generator</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#code-generator-sec">
                                      <span>Using the Code Generator</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#image-generator-sec">
                                      <span>Creating images with AI</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </li>
                            <li className="has-submenu">
                              <a className="collapse-btn collapsed" data-bs-toggle="collapse" href="#advanced" role="button" aria-expanded="false" aria-controls="advanced">
                                <span>Advanced Features</span>
                              </a>
                              <div className="collapse" id="advanced">
                                <ul className="submenu rbt-default-sidebar-list">
                                  <li>
                                    <a href="#prompt-engineering">
                                      <span>Prompt Engineering</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#model-customization">
                                      <span>Model Customization</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#batch-processing">
                                      <span>Batch Processing</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </li>
                            <li className="has-submenu">
                              <a className="collapse-btn collapsed" data-bs-toggle="collapse" href="#account" role="button" aria-expanded="false" aria-controls="account">
                                <span>Account Management</span>
                              </a>
                              <div className="collapse" id="account">
                                <ul className="submenu rbt-default-sidebar-list">
                                  <li>
                                    <a href="#profile-settings">
                                      <span>Profile Settings</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#subscription-plans">
                                      <span>Subscription Plans</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#usage-analytics">
                                      <span>Usage Analytics</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </li>
                            <li><a href="#api-integration"><span>API Integration</span></a></li>
                            <li><a href="#best-practices"><span>Best Practices</span></a></li>
                            <li><a href="#faq"><span>FAQ</span></a></li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-lg-9 inner-content pl--0">
                <div id="getstarted_section" className="single-inner-box">
                  <h3 className="section-title">Getting started</h3>
                  
                  {/* Text Generator Section */}
                  <div id="text-generator-sec" className="rbt-elements-area rbt-shadow-box">
                    <div className="wrapper">
                      <h4 className="title-sm">Connect with AI text generator</h4>
                      <div className="desc">
                        <div className="image">
                          <img src="/src/assets/images/utilize-img/ut-image-01.png" alt="Text Generator Interface" />
                        </div>
                        <p className="b1">
                          AiWave's Text Generator allows you to create high-quality content for various purposes. 
                          To get started, simply navigate to the Text Generator tool from the main dashboard. 
                          Enter your prompt in the text area, select the desired output format, and click "Generate" 
                          to receive AI-generated content tailored to your needs.
                        </p>
                        <h6>Key Features of Text Generator</h6>
                        <ul className="content-list">
                          <li>Multiple content formats including blog posts, emails, and social media content</li>
                          <li>Tone adjustment to match your brand voice (professional, casual, persuasive)</li>
                          <li>Length control to generate content of appropriate size for your needs</li>
                          <li>Keyword optimization to improve SEO performance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Code Generator Section */}
                  <div id="code-generator-sec" className="rbt-elements-area rbt-shadow-box">
                    <div className="wrapper">
                      <h4 className="title-sm">Using the Code Generator</h4>
                      <div className="desc">
                        <div className="image">
                          <img src="/src/assets/images/utilize-img/ut-image-02.png" alt="Code Generator Interface" />
                        </div>
                        <p className="b1">
                          The Code Generator is a powerful tool for developers that can create code snippets, 
                          functions, and even complete applications based on your requirements. To use this feature, 
                          select the Code Generator from the tools menu, choose your preferred programming language 
                          and code type, then describe what you need the code to do.
                        </p>
                        <h6>Supported Programming Languages</h6>
                        <ul className="content-list">
                          <li>JavaScript/TypeScript for web development and Node.js applications</li>
                          <li>Python for data science, automation, and backend development</li>
                          <li>HTML/CSS for frontend layouts and styling</li>
                          <li>Java, C#, PHP, and other popular languages for various applications</li>
                        </ul>
                        <p className="b1">
                          For best results, be specific about the functionality you need, any libraries or frameworks 
                          you're using, and provide context about where the code will be used. The more detailed your 
                          prompt, the more accurate and useful the generated code will be.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Generator Section */}
                  <div id="image-generator-sec" className="rbt-elements-area rbt-shadow-box">
                    <div className="wrapper">
                      <h4 className="title-sm">Creating images with AI</h4>
                      <div className="desc">
                        <div className="image">
                          <img src="/src/assets/images/utilize-img/ut-image-03.png" alt="Image Generator Interface" />
                        </div>
                        <p className="b1">
                          AiWave's Image Generator allows you to create stunning visuals from text descriptions. 
                          Access the Image Generator from the tools menu, enter a detailed description of the image 
                          you want to create, select style preferences, and click "Generate" to see your vision come to life.
                        </p>
                        <h6>Tips for Effective Image Generation</h6>
                        <ul className="content-list">
                          <li>Be specific about subjects, settings, lighting, and style in your descriptions</li>
                          <li>Use artistic references (e.g., "in the style of impressionism" or "like a watercolor painting")</li>
                          <li>Specify the perspective and composition you want (e.g., "aerial view" or "close-up")</li>
                          <li>Experiment with different prompts to refine your results</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Features Section */}
                <div id="advanced_section" className="single-inner-box">
                  <h3 className="section-title">Advanced Features</h3>
                  
                  <div id="prompt-engineering" className="rbt-elements-area rbt-shadow-box">
                    <div className="wrapper">
                      <h4 className="title-sm">Prompt Engineering</h4>
                      <div className="desc">
                        <p className="b1">
                          Prompt engineering is the art of crafting effective instructions for AI models to get the best results. 
                          By learning how to structure your prompts, you can significantly improve the quality and relevance of 
                          AI-generated content.
                        </p>
                        <h6>Effective Prompt Techniques</h6>
                        <ul className="content-list">
                          <li>Use clear, specific language to describe exactly what you want</li>
                          <li>Provide context and background information relevant to your request</li>
                          <li>Break complex tasks into smaller, more manageable steps</li>
                          <li>Include examples of the desired output format or style</li>
                          <li>Specify the tone, audience, and purpose of the content</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div id="model-customization" className="rbt-elements-area rbt-shadow-box">
                    <div className="wrapper">
                      <h4 className="title-sm">Model Customization</h4>
                      <div className="desc">
                        <p className="b1">
                          Premium users can access model customization options to fine-tune AI behavior for specific use cases. 
                          This allows you to create specialized versions of our AI models that better understand your industry 
                          terminology, brand voice, or specific requirements.
                        </p>
                        <h6>Customization Options</h6>
                        <ul className="content-list">
                          <li>Upload reference documents to teach the AI about your domain</li>
                          <li>Define custom templates for recurring content needs</li>
                          <li>Save and reuse successful prompts for consistent results</li>
                          <li>Adjust model parameters for creativity vs. precision balance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Integration Section */}
                <div id="api-integration" className="single-inner-box">
                  <h3 className="section-title">API Integration</h3>
                  
                  <div className="rbt-elements-area rbt-shadow-box">
                    <div className="wrapper">
                      <h4 className="title-sm">Integrating AiWave with your applications</h4>
                      <div className="desc">
                        <p className="b1">
                          Enterprise and Developer plan subscribers can access our comprehensive API to integrate 
                          AiWave's AI capabilities directly into their applications, websites, or workflows.
                        </p>
                        <h6>API Features</h6>
                        <ul className="content-list">
                          <li>RESTful endpoints for all AI generation tools</li>
                          <li>Webhook support for asynchronous processing</li>
                          <li>Comprehensive documentation and code examples</li>
                          <li>SDKs for popular programming languages</li>
                          <li>Rate limits based on your subscription tier</li>
                        </ul>
                        <p className="b1">
                          To get started with the API, visit the Developer Portal in your account settings to generate 
                          API keys and access detailed documentation. Our API follows standard REST conventions and 
                          returns responses in JSON format for easy integration with any system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Best Practices Section */}
                <div id="best-practices" className="single-inner-box">
                  <h3 className="section-title">Best Practices</h3>
                  
                  <div className="rbt-elements-area rbt-shadow-box">
                    <div className="wrapper">
                      <h4 className="title-sm">Getting the most from AiWave</h4>
                      <div className="desc">
                        <p className="b1">
                          Follow these best practices to maximize the effectiveness of AiWave's AI tools and ensure 
                          you get the highest quality outputs for your needs.
                        </p>
                        <h6>General Best Practices</h6>
                        <ul className="content-list">
                          <li>Always review and edit AI-generated content before publishing</li>
                          <li>Start with specific prompts and refine based on results</li>
                          <li>Use the regenerate option if the first result doesn't meet your needs</li>
                          <li>Save successful prompts as templates for future use</li>
                          <li>Combine multiple AI tools for comprehensive projects (e.g., generate text content and then supporting images)</li>
                        </ul>
                        <h6>Ethical Considerations</h6>
                        <ul className="content-list">
                          <li>Always disclose when content is AI-generated when required by regulations or platform policies</li>
                          <li>Verify factual information provided by AI before publishing</li>
                          <li>Respect copyright and intellectual property rights</li>
                          <li>Use AI as a tool to enhance human creativity, not replace it</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div id="faq" className="single-inner-box">
                  <h3 className="section-title">Frequently Asked Questions</h3>
                  
                  <div className="rbt-elements-area rbt-shadow-box">
                    <div className="wrapper">
                      <div className="desc">
                        <div className="accordion" id="faqAccordion">
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                What are the usage limits for each subscription plan?
                              </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                              <div className="accordion-body">
                                <p>Free users can generate up to 10,000 words of text, 5 images, and 100 lines of code per month. Premium users get 100,000 words, 50 images, and unlimited code generation. Enterprise plans have customizable limits based on your organization's needs. You can view your current usage in the Account section.</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Who owns the content created with AiWave?
                              </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                              <div className="accordion-body">
                                <p>You retain full ownership of all content created using our platform. AiWave does not claim any rights to the outputs generated by our AI tools. You are free to use, modify, and distribute the content according to your needs, subject to our Terms of Service.</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingThree">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                How secure is my data on AiWave?
                              </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                              <div className="accordion-body">
                                <p>We take data security seriously. All data is encrypted in transit and at rest. We do not use your inputs or generated outputs to train our models without explicit consent. Enterprise customers can request additional security measures including data residency options and custom data retention policies.</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingFour">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                Can I use AiWave offline?
                              </button>
                            </h2>
                            <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
                              <div className="accordion-body">
                                <p>AiWave requires an internet connection to function as our AI models run in the cloud. However, Enterprise customers can inquire about on-premises deployment options for specific use cases where data cannot leave your infrastructure.</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingFive">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                How often are the AI models updated?
                              </button>
                            </h2>
                            <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#faqAccordion">
                              <div className="accordion-body">
                                <p>We continuously improve our AI models with regular updates. Major model updates typically occur quarterly, with minor improvements and optimizations released more frequently. Check our Release Notes section for details on the latest updates and new features.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToUse;