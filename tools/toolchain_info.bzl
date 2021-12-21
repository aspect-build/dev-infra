# look at the toolchains registered in the workspace file with nodejs_register_toolchains

# the name can be anything the user wants this is just added to the target to create unique names
# the order will match against the order in the TOOLCHAIN_VERSION list.
TOOLCHAINS_NAMES = [
    "node12",
    "node14",
    "node16",
]

# this is the list of toolchains that should be used and are registered with nodejs_register_toolchains in the WORKSPACE file
TOOLCHAINS_VERSIONS = [
    select({
        "@bazel_tools//src/conditions:linux_x86_64": "@node12_linux_amd64//:node_toolchain",
        "@bazel_tools//src/conditions:darwin": "@node12_darwin_amd64//:node_toolchain",
        "@bazel_tools//src/conditions:windows": "@node12_windows_amd64//:node_toolchain",
    }),
    select({
        "@bazel_tools//src/conditions:linux_x86_64": "@node14_linux_amd64//:node_toolchain",
        "@bazel_tools//src/conditions:darwin": "@node14_darwin_amd64//:node_toolchain",
        "@bazel_tools//src/conditions:windows": "@node14_windows_amd64//:node_toolchain",
    }),
    select({
        "@bazel_tools//src/conditions:linux_x86_64": "@node16_linux_amd64//:node_toolchain",
        "@bazel_tools//src/conditions:darwin": "@node16_darwin_amd64//:node_toolchain",
        "@bazel_tools//src/conditions:windows": "@node16_windows_amd64//:node_toolchain",
    }),
]

# github-actions and ng-dev folders were not inclulded for multiple node versions. If this is desired please comment

# //bazel/api-golden/test:test
# //bazel/integration/tests/angular-cli:test
# //bazel/integration/tests/custom_env_variables:test
# //bazel/integration/tests/external_command_script:test
# //bazel/integration/tests/package_mappings:test
# //bazel/integration/tests/playwright_chromium:test
# //bazel/protos:test_status_dts
# //bazel/protos:test_status_js
# //bazel/spec-bundling/test:test
# //github-actions/commit-message-based-labels:main
# //github-actions/commit-message-based-labels:post
# //github-actions/feature-request:main
# //github-actions/feature-request:post
# //github-actions/feature-request:test
# //github-actions/lock-closed:main
# //github-actions/lock-closed:post
# //github-actions/slash-commands:main
# //github-actions/slash-commands:post
# //ng-dev/caretaker:test
# //ng-dev/commit-message:test
# //ng-dev/pr/merge:test
# //ng-dev/pullapprove:test
# //ng-dev/release/build:test
# //ng-dev/release/notes:test
# //ng-dev/release/set-dist-tag:test
# //ng-dev/release/versioning/test:test
# //tools/jasmine:test
# //tools/local-actions/changelog:main
# //tools/local-actions/changelog:post
# //bazel/integration/tests/nested_bazel_workspaces:basic     FAILED
# //ng-dev/release/publish/test:test                          FAILED
