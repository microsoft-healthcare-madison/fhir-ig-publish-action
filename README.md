# FHIR IG Publish Action Info

This repo contains a GitHub Action for downloading and running the FHIR IG Publisher on a repository.

# Documentation

## Prerequisites

* Repository must be checked out: [actions/checkout@v2](https://github.com/actions/checkout)
* Java must be installed: [actions/setup-java](https://github.com/actions/setup-java), version 14+ is required

## Example

The following steps can be used in your `build.steps[]` within a Github Actions pipeline to invoke the FHIR IG Publisher:

```yaml
    steps:
    - uses: actions/checkout@v2

    - name: Set up Java v15
      uses: actions/setup-java@v1
      with:
        java-version: 15

    - name: Set up Jekyll
      uses: helaili/jekyll-action@2.0.1

    - name: Run IG publisher
      uses: microsoft-healthcare-madison/fhir-ig-publish-action@v1.0.0-beta

```

For a full example including invocation of Sushi before the build, see https://github.com/argonautproject/subscription-backport-ig/blob/master/.github/workflows/build.yml.


## More Information


## Contributing
This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

There are many other ways to contribute:
* [Submit bugs](https://github.com/fhir-ig-publish-action/issues) and help us verify fixes as they are checked in.
* Review the [source code changes](https://github.com/fhir-ig-publish-action/pulls).
* Engage with users and developers on [Official FHIR Zulip](https://chat.fhir.org/)
* [Contribute bug fixes](CONTRIBUTING.md).

See [Contributing](CONTRIBUTING.md) for more information.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

FHIR&reg; is the registered trademark of HL7 and is used with the permission of HL7. 
